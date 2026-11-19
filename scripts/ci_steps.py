"""Set up and rehearse the classroom example in CI on any supported OS."""

import argparse
import os
from pathlib import Path
import shlex
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request


PREVIEW_HOST = "127.0.0.1"
PREVIEW_PORT = 8787
QA_BASE = f"http://{PREVIEW_HOST}:{PREVIEW_PORT}"
HEALTH_URL = f"{QA_BASE}/health"
REHEARSAL_SCRIPTS = (
    "scripts/export_presentation.py",
    "scripts/export_speaker_pdfs.py",
    "scripts/qa_browser.py",
    "scripts/qa_race_cooperation.py",
    "scripts/qa_apa.py",
    "scripts/qa_walkthrough.py",
    "scripts/check_public_package.py",
)


def venv_python(venv_root: Path, os_name: str) -> Path:
    if os_name == "nt":
        return venv_root / "Scripts" / "python.exe"
    return venv_root / "bin" / "python"


def print_command(command: list[str]) -> None:
    formatted = subprocess.list2cmdline(command) if os.name == "nt" else shlex.join(command)
    print(f"+ {formatted}", flush=True)


def run(command: list[str], root: Path, env: dict[str, str]) -> None:
    print_command(command)
    subprocess.run(command, cwd=root, env=env, check=True)


def setup(root: Path, python: Path, env: dict[str, str]) -> None:
    if not python.is_file():
        run([sys.executable, "-m", "venv", str(root / ".venv")], root, env)
    else:
        expected = f"{sys.version_info.major}.{sys.version_info.minor}"
        command = [str(python), "-c", "import sys; print('%d.%d' % sys.version_info[:2])"]
        print_command(command)
        try:
            result = subprocess.run(
                command, cwd=root, env=env, check=True, stdout=subprocess.PIPE, encoding="utf-8"
            )
            version = result.stdout.strip()
        except (OSError, subprocess.CalledProcessError, UnicodeError):
            version = ""
        if version != expected:
            detail = f"`.venv` uses Python {version}" if version else "Could not read the Python version from `.venv`"
            raise RuntimeError(f"{detail}, expected {expected}; remove `.venv` and run setup again")

    run([str(python), "-m", "pip", "install", "-r", "requirements-dev.txt"], root, env)
    run([str(python), "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"], root, env)
    install = [str(python), "-m", "playwright", "install"]
    if sys.platform.startswith("linux"):
        install.append("--with-deps")
    run([*install, "chromium"], root, env)


def check_preview_port() -> None:
    try:
        with socket.create_connection((PREVIEW_HOST, PREVIEW_PORT), timeout=0.25):
            pass
    except OSError:
        return
    raise RuntimeError(f"port {PREVIEW_PORT} is in use; stop the other preview first")


def check_preview_running(server: subprocess.Popen) -> None:
    exit_code = server.poll()
    if exit_code is not None:
        raise RuntimeError(f"Preview server exited unexpectedly with code {exit_code}.")


def wait_for_preview(server: subprocess.Popen) -> None:
    for attempt in range(30):
        check_preview_running(server)
        try:
            with urllib.request.urlopen(HEALTH_URL, timeout=1):
                return
        except OSError:
            if attempt < 29:
                time.sleep(1)
    raise RuntimeError(f"Preview server did not answer at {HEALTH_URL} after 30 attempts.")


def stop_preview(server: subprocess.Popen) -> None:
    if server.poll() is not None:
        return
    server.terminate()
    try:
        server.wait(timeout=5)
    except subprocess.TimeoutExpired:
        server.kill()
        server.wait()


def rehearse(root: Path, python: Path, env: dict[str, str]) -> None:
    if not python.is_file():
        raise RuntimeError("run `ci_steps.py setup` first")
    if not (root / "dist/server/index.js").is_file():
        raise RuntimeError("run `npm run build` first")
    if shutil.which("git") is None or not (root / ".git").exists():
        raise RuntimeError("the final package check needs Git and a cloned checkout")
    check_preview_port()

    env.update(HOST=PREVIEW_HOST, PORT=str(PREVIEW_PORT), QA_BASE=QA_BASE)
    command = ["node", "scripts/preview.mjs"]
    with tempfile.TemporaryDirectory() as directory:
        log_path = Path(directory) / "preview.log"
        try:
            with log_path.open("w", encoding="utf-8") as log:
                print_command(command)
                server = subprocess.Popen(command, cwd=root, env=env, stdout=log, stderr=subprocess.STDOUT)
                try:
                    wait_for_preview(server)
                    check_preview_running(server)
                    for script in REHEARSAL_SCRIPTS:
                        run([str(python), script], root, env)
                    check_preview_running(server)
                finally:
                    stop_preview(server)
        except BaseException:
            if log_path.is_file():
                print("Preview server log:", file=sys.stderr, flush=True)
                print(log_path.read_text(encoding="utf-8", errors="replace"), file=sys.stderr, flush=True)
            raise


def main(root: Path | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("step", choices=("setup", "rehearse"))
    args = parser.parse_args()
    if root is None:
        root = Path(__file__).resolve().parents[1]
    python = venv_python(root / ".venv", os.name)
    env = os.environ.copy()
    env.update(PYTHONUTF8="1", PYTHONIOENCODING="utf-8")
    try:
        if args.step == "setup":
            setup(root, python, env)
        else:
            rehearse(root, python, env)
    except (OSError, RuntimeError, subprocess.CalledProcessError) as error:
        print(f"{args.step} failed: {error}", file=sys.stderr, flush=True)
        return 1
    except KeyboardInterrupt:
        print(f"{args.step} interrupted.", file=sys.stderr, flush=True)
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
