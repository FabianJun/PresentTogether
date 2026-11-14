---
name: interactive-classroom-presentation
description: Collaboratively adapt a teacher's existing presentation into a tested interactive activity with clear roles, individual participation, readable results, presenter guidance and matching exports. Use when designing or improving classroom games or simulations with a coding agent, including for nontechnical teachers.
---

# Interactive classroom presentation

Use AI to support the teacher's competence and implementation work. Start from their material, learning goals and judgement. Work through small iterations together; do not silently replace the presentation with a generic deck or game.

This repository's workflow is scoped to **ungraded presentations using the user's own shareable content**. Do not ingest the institution (the institution) teaching materials into external agents. Do not use this workflow to produce graded work or graded submissions. If those conditions are unclear, clarify them before reading teaching files. Ungraded does not automatically exempt a submission from institutional rules. Direct submission-related work to the current approved institutional process and AI tutor; do not claim this skill establishes institution's GenAI compliance. Use public or user-authored non-assessment material for an independent demonstration.

## Understand the teaching task

Read the supplied presentation and notes. Summarise the central idea and identify one place where making a decision could teach something that listening alone may not. Preserve evidence, citations and the distinction between a real case, a scenario and a modelling assumption.

Use available context for audience, language, class size, timing and presenter roles. Ask only for missing information that changes the activity. For an open brief, suggest two concrete activities, recommend one, and explain what students do and learn. Agree on the teaching choice before substantial implementation. For an already agreed activity, continue without reopening settled choices.

## Carry the technical work

Assume the teacher may be new to software. Inspect the existing project, choose compatible defaults and explain important decisions in plain language: **recommendation, reason, cost, next action**. Do not make them choose a framework or database without a teaching or budget reason.

Start with a local preview. Explain what is local versus publicly accessible. Provide a link and precise instructions for trying it. Keep a working version while iterating. Make the result and setup reviewable before asking for any required publishing or spending approval. A skill does not grant permission to create cloud resources or publish data.

For this task, recommend a capable general-purpose coding model with High reasoning effort as a starting point, such as Sol or Opus where available. Verify the user's actual tool, access and current cost. Explain that model tiers differ between providers and higher effort uses more time or allowance. Routine edits may need less effort; do not assume maximum settings are necessary.

Before hosting, verify current provider prices and account eligibility. Explain VM, storage, public address, traffic, domain and agent/API costs separately; distinguish a trial from an ongoing allowance. Recommend the smallest appropriate setup with a stated capacity assumption, budget alert, backup and shutdown plan. Never promise that a micro VM or a subscription around €20 will cover every workload. Prefer a runtime with no AI API dependency when the activity is a deterministic simulation.

## Design participation and consequences

Each participant should immediately know their side, role, goal, tension and available action. Keep a short role perspective visible beside the choice. If there are unique roles, define a useful repeatable role for everyone else and balance groups. Do not use national or social stereotypes to stand in for motives.

Prefer one meaningful decision to several decorative votes. Consequences must connect to the lesson. Distinguish competitive rewards from shared wellbeing or safety. Make costs, benefits and affected people visible. A high score is not automatically a morally good outcome.

Write the rules before implementation: every choice combination, calculation, cap, threshold, aggregation rule and tie/missing-response rule. Label teaching assumptions. Explain why each measure is necessary; remove unused or opaque measures. Use the simplest rules that preserve the intended dilemma. This repository's four-round game and government tie-break are examples, not universal requirements.

## Build for attention and facilitation

Use the teacher's visual style. One central idea per slide, large readable text, a meaningful diagram where helpful, and short labels. Keep detailed explanation in notes. Avoid descriptive subtitles and text that merely narrates the picture. Do not remove useful technical or ethical terms already taught; explain new terms in everyday language.

Provide distinct moderator, projection, speaker and participant views where needed. Only the moderator changes the shared session. Keep private links out of the projection. Show the join code prominently at the right moment. Include a short **skippable, reopenable walkthrough** of the teacher's controls; completing it must not change slides, create votes, or reset a session.

Speaker notes should follow the current phase: introduce the round, invite an individual choice, explain the actual result, then move on. Use short SAY / DO / NEXT cues. Match the current slide and mechanics exactly. Keep presenter blocks and timings appropriate to the user's plan. Include pauses, transitions and participant response time in a rehearsal estimate.

After each reveal, show choices, vote counts, points gained, cumulative totals, the shared-state change, and who carries the cost or risk. Do not obscure the outcome with another unnecessary poll. End by connecting the class's actual decisions to the learning goal, with the model's limitations stated plainly.

## Verify and hand over

Use [the rehearsal checklist](references/rehearsal.md) according to the activity. Test rules independently of rendering, then test complete browser flows with synthetic participants. Keep test sessions separate from real sessions. Never invent audience responses. Test all small finite choice paths where feasible; otherwise use explicit invariants and representative edge cases.

Check mobile role clarity, projection readability, actual-result explanations, current speaker views, missing votes, ties, reconnects, duplicate submissions and guarded reset. Test a room with one participant on each side. If a side has no votes, distinguish any facilitator fallback from participant votes.

Generate exports from the same content as the live presentation. Verify page count, current notes, citations, links and clipping. Static examples must be labelled; a saved PDF cannot contain a future room's live QR code. Protect private speaker access, student data, credentials and backups. Review binary exports as well as source files before public sharing.

Give the teacher the preview or public link, operating instructions, exports, backup location and a short account of what was tested. State untested capacity or accessibility limits honestly. Ask them to try one complete rehearsal and use their feedback for the next small revision.

Help save the reviewed code and teaching material to the teacher's own GitHub account when requested; keep live data and credentials in a private backup. Explain how the agent can later switch activities on the same small VM, preserving the old version and checking database compatibility. Prompt for an event-end reminder to back up and stop hosting. Do not claim a reminder was scheduled unless it actually was, and do not schedule a shutdown without approval. Explain that a stopped VM can retain billable disks or addresses.
