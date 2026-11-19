from contextlib import redirect_stderr, redirect_stdout
from functools import cache
import importlib.util
from io import StringIO
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch


CI_STEPS_PATH = Path(__file__).resolve().parents[1] / "scripts" / "ci_steps.py"


@cache
def load_ci_steps():
    spec = importlib.util.spec_from_file_location("ci_steps", CI_STEPS_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class CiStepsTests(unittest.TestCase):
    def test_import_without_side_effects(self):
        spec = importlib.util.spec_from_file_location("ci_steps_import_test", CI_STEPS_PATH)
        module = importlib.util.module_from_spec(spec)

        with (
            patch("argparse.ArgumentParser.parse_args") as parse_args,
            patch("subprocess.run") as run,
            patch("subprocess.Popen") as popen,
            patch("tempfile.TemporaryDirectory") as temporary_directory,
            patch("urllib.request.urlopen") as urlopen,
            patch("pathlib.Path.open") as open_path,
            patch("builtins.print") as print_output,
        ):
            spec.loader.exec_module(module)

        for effect in (parse_args, run, popen, temporary_directory, urlopen, open_path, print_output):
            effect.assert_not_called()

    def test_venv_python_on_posix(self):
        ci_steps = load_ci_steps()
        venv_root = Path(".venv")
        self.assertEqual(ci_steps.venv_python(venv_root, "posix"), venv_root / "bin/python")

    def test_venv_python_on_windows(self):
        ci_steps = load_ci_steps()
        venv_root = Path(".venv")
        self.assertEqual(ci_steps.venv_python(venv_root, "nt"), venv_root / "Scripts/python.exe")

    def test_setup_rejects_venv_version_mismatch(self):
        ci_steps = load_ci_steps()
        version_info = ci_steps.sys.version_info
        expected = f"{version_info.major}.{version_info.minor}"
        other = f"{version_info.major}.{version_info.minor + 1}"
        stderr = StringIO()
        with (
            tempfile.TemporaryDirectory() as directory,
            patch.object(ci_steps.sys, "argv", ["ci_steps.py", "setup"]),
            patch.object(ci_steps.subprocess, "run", return_value=Mock(stdout=f"{other}\n")) as run,
            redirect_stdout(StringIO()),
            redirect_stderr(stderr),
        ):
            root = Path(directory)
            python = ci_steps.venv_python(root / ".venv", ci_steps.os.name)
            python.parent.mkdir(parents=True)
            python.touch()

            self.assertEqual(ci_steps.main(root), 1)
            run.assert_called_once()
            self.assertEqual(run.call_args.args[0], [
                str(python), "-c", "import sys; print('%d.%d' % sys.version_info[:2])"
            ])
            self.assertTrue(python.is_file())

        self.assertIn(
            f"`.venv` uses Python {other}, expected {expected}; remove `.venv` and run setup again",
            stderr.getvalue(),
        )


class RehearsalTests(unittest.TestCase):
    def setUp(self):
        self.ci_steps = load_ci_steps()
        self.root = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.python = self.ci_steps.venv_python(self.root / ".venv", self.ci_steps.os.name)
        self.python.parent.mkdir(parents=True)
        self.python.touch()
        build = self.root / "dist/server/index.js"
        build.parent.mkdir(parents=True)
        build.touch()
        (self.root / ".git").mkdir()

        self.enterContext(patch.object(self.ci_steps.shutil, "which", return_value="git"))
        self.connect = self.enterContext(patch.object(
            self.ci_steps.socket, "create_connection", side_effect=ConnectionRefusedError
        ))
        self.server = Mock()
        self.server.poll.return_value = None
        self.popen = self.enterContext(patch.object(self.ci_steps.subprocess, "Popen", return_value=self.server))
        self.run = self.enterContext(patch.object(self.ci_steps.subprocess, "run"))
        self.urlopen = self.enterContext(patch.object(self.ci_steps.urllib.request, "urlopen"))
        self.enterContext(patch.object(self.ci_steps.time, "sleep"))
        self.enterContext(redirect_stdout(StringIO()))

    def run_rehearsal(self):
        stderr = StringIO()
        with patch.object(self.ci_steps.sys, "argv", ["ci_steps.py", "rehearse"]), redirect_stderr(stderr):
            result = self.ci_steps.main(self.root)
        return result, stderr.getvalue()

    def test_preview_exit_prevents_scripts(self):
        for poll_results in ([42, 42], [None, 42, 42]):
            with self.subTest(poll_results=poll_results):
                self.server.poll.side_effect = poll_results
                with redirect_stderr(StringIO()), self.assertRaisesRegex(RuntimeError, "exited unexpectedly"):
                    self.ci_steps.rehearse(self.root, self.python, {})

                self.server.poll.side_effect = poll_results
                result, error = self.run_rehearsal()
                self.assertEqual(result, 1)
                self.assertIn("Preview server exited unexpectedly with code 42", error)
                self.run.assert_not_called()

    def test_health_timeout_stops_preview(self):
        self.urlopen.side_effect = OSError

        result, error = self.run_rehearsal()

        self.assertEqual(result, 1)
        self.assertIn("did not answer at http://127.0.0.1:8787/health after 30 attempts", error)
        self.assertEqual(self.urlopen.call_count, 30)
        self.run.assert_not_called()
        self.server.terminate.assert_called_once_with()

    def test_failing_script_stops_preview_and_skips_remaining_scripts(self):
        scripts = self.ci_steps.REHEARSAL_SCRIPTS
        failed_command = [str(self.python), scripts[1]]
        self.run.side_effect = [None, self.ci_steps.subprocess.CalledProcessError(1, failed_command)]

        result, error = self.run_rehearsal()

        self.assertEqual(result, 1)
        self.assertIn(scripts[1], error)
        self.assertEqual([call.args[0] for call in self.run.call_args_list], [
            [str(self.python), scripts[0]], failed_command
        ])
        self.server.terminate.assert_called_once_with()

    def test_busy_port_prevents_preview_start(self):
        self.connect.side_effect = None

        result, error = self.run_rehearsal()

        self.assertEqual(result, 1)
        self.assertIn("port 8787 is in use; stop the other preview first", error)
        self.connect.assert_called_once_with(("127.0.0.1", 8787), timeout=0.25)
        self.popen.assert_not_called()
        self.run.assert_not_called()

    def test_preview_and_scripts_use_the_same_pinned_environment(self):
        expected = {
            "HOST": "127.0.0.1",
            "PORT": "8787",
            "QA_BASE": "http://127.0.0.1:8787",
            "PYTHONUTF8": "1",
            "PYTHONIOENCODING": "utf-8",
        }
        inherited = dict.fromkeys(expected, "inherited-value")
        with patch.dict(self.ci_steps.os.environ, inherited):
            result, error = self.run_rehearsal()
            self.assertEqual({key: self.ci_steps.os.environ[key] for key in expected}, inherited)

        self.assertEqual(result, 0, error)
        env = self.popen.call_args.kwargs["env"]
        self.assertEqual({key: env[key] for key in expected}, expected)
        self.assertEqual([call.args[0][1] for call in self.run.call_args_list], list(self.ci_steps.REHEARSAL_SCRIPTS))
        for call in self.run.call_args_list:
            self.assertIs(call.kwargs["env"], env)
