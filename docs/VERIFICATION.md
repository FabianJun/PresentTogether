# Verification record

The checks below record their own scope and date. Application checks use synthetic participants, not real classroom responses.

## PDF dependency replacement

Checked on 2026-11-17; see the [decision record](DECISIONS.md). Committed exports were not regenerated.

| Check | Result |
|---|---|
| `python -m unittest discover -s tests -p "test_*.py"` | Pass: 19 tests covering all PDF helpers, the committed presentation, synthetic PDFs, link targets other than web addresses, backslash paths in metadata and the legacy-import guard. |
| Full browser export run with the replacement | Unchecked until the next local export or CI run. |

## Institution-agnostic academic use

Revised on 15 November 2026. The owner brings current institutional policy, module or course instructions and lecturer guidance. The stricter rule takes precedence alongside the general check; institutional permission does not relax the project's conservative boundary. Only the unfilled institutional rule template is shipped. Completed rule notes stay in the owner's own copy or outside this repository and are never committed here.

Institution and company names were removed from the example's displayed wording and citation labels; source URLs and technical product and model names were retained. Vendor-as-actor wording was replaced with neutral source attribution. Notes and existing exports were updated together; the game rules and presentation roles remain unchanged.

## Coaching and vendor-neutral revision

The guide and skill were rewritten around competence-enhancing coaching: the agent helps a teacher or student explain their own content better, names each method with its evidence, asks for their view first at four moments, and ends with a personal method card. Product and model names are kept in `references/tools-and-models.md`. Academic-use guidance is institution-agnostic: current institutional, course and lecturer rules apply alongside the general check, with the stricter rule taking precedence. Completed rule templates stay in the owner's own copy or outside this repository; `references/institutions/` ships only `TEMPLATE.md`. The Singularity example's game rules and application behaviour remain unchanged.

| Check | Result |
|---|---|
| `scripts/check_public_package.py` | Pass: local links, private-path patterns, binary metadata and exports. |
| Local links and heading anchors in all Markdown files | Pass. |
| Skill frontmatter against the Agent Skills specification | Pass: name matches the folder, description under 1,024 characters, body under 500 lines. |
| Product names outside the allowed files | Only the hosting example and font notice. |
| Method-card sources | Each cited study was looked up on 14 November 2026; cards without direct evidence are labelled *Practice*. |
| Independent review of the whole change | Findings on the use boundary, question count, route consistency and overstated evidence were fixed, then reviewed again. |
| Cold start with two different coding agents, given read-only tools and a fictitious overloaded talk | First runs: both gave a tool check, a short permitted-use check and the route, but both opened the slides before the check finished, and one did not ask for the core message. After tightening the first reply, a re-run asked for the core message but still opened the slides early and called graded use "fine". After a further fix, the final run left the slides closed, stated the boundary correctly and asked for the core message. It still reported being able to run code, which its read-only test setup did not allow. Instructions alone may not prevent agents from overstating their tools, so people should check these claims. |

These are instruction checks with a small number of runs. They do not prove that every agent follows the skill, and the project has not been built end to end in every named tool. The Mermaid diagram in the README was not rendered locally.

## Verify capabilities before recommending a tool

The owner identified missing repository and file access in the available setup. The earlier tool recommendation was withdrawn from the starter guide, model guidance and skill. Those access limits were not independently inspected. General product documentation did not establish that the available account could complete the workflow.

The entry point now asks the agent to verify repository, file, execution and testing access before requesting teaching files. Review covers a permitted local-file fallback when GitHub cannot be read, and switching to a capable, permitted tool when both routes are unavailable. The policy guidance remains abstracted, and the example's application and exports are unchanged. These are instruction checks, not a tested build through every named product.

## present-together workflow revision

The guide and skill now cover collaborative activity design across topics. Singularity remains one worked example. The revision was reviewed against these cases:

| Case reviewed | What the instructions require |
|---|---|
| A sorting activity with ambiguous examples | Explain defensible alternatives; do not introduce points, teams or a fictional role by default. |
| A visual annotation activity | Check placement, labels, screen sizes and an accessible alternative. |
| A shared simulation | Specify assumptions, calculations and incomplete-response behaviour; test shared state separately from rendering. |
| An ungraded submission where the owner's institution restricts AI use | Apply both the general submission boundary and the current institutional restriction before reading teaching files; ungraded is not an exemption, and the stricter rule takes precedence. |
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

Local/browser checks do not prove capacity for an arbitrary class, accessibility conformance, cloud billing eligibility or academic-policy compliance. Rehearse on the intended devices and network. The new deployment templates still need validation on the chosen cloud VM. [Development commands](DEVELOPMENT.md) · [Academic-use boundary](ACADEMIC-USE.md)
