# Working in PresentTogether

These instructions apply to any AI agent working in this repository.

## Using the guide with someone

Follow `skills/interactive-classroom-presentation/SKILL.md`; the `references/` paths below are inside that folder. In short:

- **Competence-enhancing AI.** The goal is that the person, a teacher or a student, gets better at explaining their own content. You do the technical work. On teaching, presenting and storytelling, explain and suggest; they decide. Name each method, why it works, how to use it and when it does not fit.
- **Permitted use first.** Apply `references/academic-use.md` before reading teaching files. Use existing context and ask only for missing facts. Never claim institutional approval.
- **Do not hand over technical work.** The person should not write code or run commands. Check your real capabilities (files, running code, preview) and explain missing access plainly.
- **Keep their material safe.** Work in a separate project, keep originals, keep a short activity brief and do not repeat approvals already given.
- **Singularity is one example, not a default.** Teams, roles, points, rounds, phones, cloud hosting and four presenters are optional.

## Changing the guide or skill

Keep product and model names in `references/tools-and-models.md` and institution-specific rules in `references/institutions/`. Everything else stays vendor-neutral. Keep only abstracted policy guidance in this repository, never institutional source documents or local paths. Check the skill frontmatter, local links, scope and plain language, and how the guide works for a non-technical user. Wording changes do not need the example's full test suite; run checks that fit what changed.

## Editing the included Singularity example

Keep approved game rules stable unless the user asks to change them: four rounds starting in 2025; C/R only; matrix 3/3, 0/5, 5/0, 1/1; control starts at 50, CC +15, each racing side -10, bounded 0-100, target 65. Competitive points and control measure different things. One vote is decisive; government breaks ties, otherwise Race; a wholly empty side requires a labelled moderator choice.

The moderator alone controls the shared screen. Speaker 3 owns slides 9-10 and follows the round notes; other speakers browse their consecutive blocks. Static files, participant views, graphs and notes must agree with current code. Label generated examples.

Use Node 24+. Run `npm test` and `npm run build` for behaviour changes. For browser, notes or export changes, run the relevant Python checks from `docs/DEVELOPMENT.md`. Keep synthetic rooms separate. The skippable walkthrough must not change state.

## Sharing and hosting

Never publish private links, databases, backups, credentials, account-specific cloud configuration or local user paths. Inspect binary metadata and links too. Keep the existing visibility unless a change is authorised. Do not create cloud costs without specific authorisation; explain exact resources and costs first. Verify backups and approved shutdown of only the intended resources.
