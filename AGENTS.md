# Working in this repository

Read `README.md` and `docs/ACADEMIC_USE.md` before adapting teaching material. Use `skills/interactive-classroom-presentation/SKILL.md` for collaborative activity design. The teacher owns the content, learning goal and final judgement. Recommend technical defaults and explain costs and controls plainly.

Keep this example's rules stable unless the user asks to change them: four rounds starting in 2025; C/R only; matrix 3/3, 0/5, 5/0, 1/1; control starts at 50, CC +15, each racing side -10, bounded 0–100, target 65. Competitive points and the control score mean different things. A single vote is decisive; government breaks ties, otherwise Race; a wholly empty side requires a labelled moderator choice.

The moderator alone controls the shared screen. Speaker 3 owns slides 9–10 and follows the round notes; other speakers browse their own consecutive blocks. Static files, participant views, graphs and notes must agree with current code. Keep generated examples clearly labelled.

Use Node 24+. Run `npm test` and `npm run build` for changes to behaviour. For browser/notes/export changes, run the relevant Python checks described in `docs/DEVELOPMENT.md`. Keep test rooms and synthetic responses separate from real sessions. The walkthrough must be skippable and must not change the game state.

Never publish data, private links, backups, credentials, account-specific cloud configuration or local user paths. Check binary export metadata and links too. Do not deploy or incur cloud costs without the user's specific authorisation. Before event hosting, explain costs, test capacity, create a private backup and agree an end-of-event shutdown reminder.
