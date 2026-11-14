# Working in PresentTogether

The main product is the general guide and reusable agent skill. Read `README.md` and `skills/interactive-classroom-presentation/SKILL.md` before adapting teaching material. Singularity is one worked example, not the default activity for every topic.

First apply `skills/interactive-classroom-presentation/references/academic-use.md` before reading teaching files. Use existing context; clarify only unresolved eligibility facts. Keep only abstracted policy guidance in this repository, never institutional source documents or local paths. Do not claim institutional approval.

The user provides subject knowledge, permitted material, judgement and feedback. The agent analyses, proposes suitable approaches, makes technical choices, builds, tests and handles authorised deployment. The teacher should not write code or run cloud commands. Check actual capabilities, including file access, execution and preview. Explain missing access and guide to a suitable tool rather than leaving an implementation task to the teacher.

For a new activity, create a separate project, preserve the original, maintain a short design brief and iterate with the user. Choose the simplest format that teaches the concept. Teams, roles, points, rounds, phones, cloud hosting and four presenters are optional. Existing authorisation persists; do not repeat settled approvals.

For guide or skill changes, validate the skill format, links, scope and clarity. Review how it applies to different formats and a nontechnical user. Do not run the entire example's game suite just to validate wording; run checks appropriate to changed code or exports.

## Editing the included Singularity example

Keep approved game rules stable unless the user asks to change them: four rounds starting in 2025; C/R only; matrix 3/3, 0/5, 5/0, 1/1; control starts at 50, CC +15, each racing side -10, bounded 0-100, target 65. Competitive points and control measure different things. One vote is decisive; government breaks ties, otherwise Race; a wholly empty side requires a labelled moderator choice.

The moderator alone controls the shared screen. Speaker 3 owns slides 9-10 and follows the round notes; other speakers browse their consecutive blocks. Static files, participant views, graphs and notes must agree with current code. Label generated examples.

Use Node 24+. Run `npm test` and `npm run build` for behaviour changes. For browser, notes or export changes, run relevant Python checks from `docs/DEVELOPMENT.md`. Keep synthetic rooms separate. The skippable walkthrough must not change state.

## Sharing and hosting

Never publish private links, databases, backups, credentials, account-specific cloud configuration or local user paths. Inspect binary metadata and links too. Keep the existing visibility unless a change is authorised. Do not create cloud costs without specific authorisation; explain exact resources and costs first. Verify backups and approved shutdown of only the intended resources.
