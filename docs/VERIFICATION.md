# Verification record

Public package checked on 14 November 2026. These checks use synthetic participants, not real classroom responses.

| Check | Result |
|---|---|
| `npm test` | 30 tests passed, including all 256 four-round choice paths. |
| Build | Passed with Node 24.19.0. No account-specific hosting metadata required. |
| Complete game in browser | Passed: one moderator, four read-only speaker views, individual votes, all rounds, current notes, final debrief and guarded reset. |
| Mobile views | Passed: 20 role/round combinations at 360 × 800; only C/R choices, accurate points and control. |
| Slide references | Passed: 15 slides, matched citations and bibliography, quote locator, hanging indents and text bounds. |
| Presenter guide | Passed: skip, reopen, Escape, back, complete and narrow-screen checks; no changes to game state and no guide on the audience projection. |
| Full exports | 17-slide PowerPoint with current editable notes; matching 17-page searchable PDF, references and two labelled examples. |
| Individual speaker PDFs | All four generated and checked for exact spoken text, actions, handovers and clipping; 5, 5, 8 and 3 pages respectively. |
| Skill | Passed the skill format validator. |
| Deployment shell syntax | Passed Bash syntax checks. No new cloud VM was deployed. |
| Public package | Passed: 82 tracked files, local documentation links, PDF/PPTX metadata and links, and exclusion of former deployment details and personal presenter names. |
| Secrets | Gitleaks 8.30.1 staged scan passed with no findings; fresh-history scan repeated before push. |

The repository starts with a fresh public history. Original private history, real session data, recovery archives and cloud account configuration are excluded. Public package checks inspect local links, file paths and PDF/PPTX text, metadata and links. Secret-scanner output is kept outside tracked files. No scan can guarantee that arbitrary future additions are safe.

Local/browser checks do not prove capacity for an arbitrary class, accessibility conformance, cloud billing eligibility or academic-policy compliance. Rehearse on the intended devices and network. The new deployment templates still need validation on the chosen cloud VM. [Development commands](DEVELOPMENT.md) · [Academic-use boundary](ACADEMIC_USE.md)
