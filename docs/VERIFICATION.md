# Verification record

Public package checked on 14 November 2026. Application checks use synthetic participants, not real classroom responses.

## University Copilot guidance

The starter prompt, beginner's guide and skill recommend checking existing university access before buying a subscription, using the Microsoft Copilot desktop app and choosing Sol with High reasoning effort where available. Official Microsoft documentation was checked for installation, account protection, model controls and licensing. The the institution account guidance remains abstracted; no institutional source files were added.

Review covered included Chat access without Cowork, missing model controls, a personal rather than university account, and the distinction from GitHub Copilot. The agent must check permission, capability and extra costs before proceeding. The skill validator and public-package checks passed. Actual university entitlements and a full build through Copilot were not tested; the example's application and exports are unchanged.

## PresentTogether workflow revision

The guide and skill now cover collaborative activity design across topics. Singularity remains one worked example. The revision was reviewed against these cases:

| Case reviewed | What the instructions require |
|---|---|
| A sorting activity with ambiguous examples | Explain defensible alternatives; do not introduce points, teams or a fictional role by default. |
| A visual annotation activity | Check placement, labels, screen sizes and an accessible alternative. |
| A shared simulation | Specify assumptions, calculations and incomplete-response behaviour; test shared state separately from rendering. |
| An ungraded graded submission | Apply the submission restriction before reading teaching files; ungraded is not an exemption. |
| A nontechnical teacher using a tool with limited access | Identify the missing capability and guide setup or handover; do not ask the teacher to write code or deploy. |
| External participation without a hyperscaler account | Choose suitable managed or static hosting where it fits; verify the external link and any shared results. |

This is an instruction review, not evidence that every agent will follow the skill correctly. Product guidance uses official sources, checked on the date above; the project has not been built end to end in every named tool.

The skill format validator, local link checks, public-package checks and staged Gitleaks scan passed. The regenerated example exports contain the new setup URL. Comparison with the previous version confirmed identical slide images and PDF text across all 17 pages; speaker notes differ only in that URL. No teaching content, game mechanics or deployed cloud resources changed in this revision.

## Singularity example checks

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
| Public package | Passed: 86 tracked files, local documentation links, PDF/PPTX metadata and links, and exclusion of former deployment details and personal presenter names. |
| Secrets | Gitleaks 8.30.1 staged scan passed with no findings; fresh-history scan repeated before push. |

The repository starts with a fresh public history. Original private history, real session data, recovery archives and cloud account configuration are excluded. Public package checks inspect local links, file paths and PDF/PPTX text, metadata and links. Secret-scanner output is kept outside tracked files. No scan can guarantee that arbitrary future additions are safe.

Local/browser checks do not prove capacity for an arbitrary class, accessibility conformance, cloud billing eligibility or academic-policy compliance. Rehearse on the intended devices and network. The new deployment templates still need validation on the chosen cloud VM. [Development commands](DEVELOPMENT.md) · [Academic-use boundary](ACADEMIC_USE.md)
