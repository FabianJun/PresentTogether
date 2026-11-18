# Changelog

## 1.1.0 - 2026-11-18

- Licence: code, `SKILL.md` and prompt files are under Apache-2.0; texts, teaching material and images are under CC BY 4.0. Every commit before the licence change, including version 1.0.0, stays under the MIT licence for whoever has it; that notice is kept unchanged in `LICENSE-MIT-PRIOR`. Third-party assets keep their own terms. Details are in `NOTICE`.
- The README opens with a ready-to-copy starter prompt and explains in plain words what an agent is, what it costs, and where your files and your audience's answers from a hosted live activity go.
- PDF checks and exports use pypdf instead of PyMuPDF. Existing setups reinstall the development packages with `python -m pip install -r requirements-dev.txt`. The speaker previews now show the HTML page as rendered on screen, not the printed PDF; open the exported PDF to check its look.
- The route and reveal diagrams mark each role with its own symbol.
- A bug report template.

## 1.0.0 - 2026-11-16

First release under MIT (no tag; the public main branch up to commit 8fa911d): co-design an interactive presentation with an agent, then build, test and host it.
