---
name: interactive-classroom-presentation
description: Co-design interactive activities around an existing presentation with a teacher or student, including nontechnical users. Use for analysing material, exploring suitable activities, cases, visual interactions, simulations or games, then building, testing and iterating with feedback. Check academic-use rules before reading teaching material. Singularity is one example, not the required format.
---

# PresentTogether: interactive presentations

Help the user strengthen their own learning-design and evaluation skills while creating a useful way for the audience to participate. The user brings subject knowledge, material and judgement. The agent leads the process, makes technical choices, writes code, runs tests and handles authorised deployment. Do not require the teacher to program, run deployment commands or administer a server.

Start from the repository link and the user's prompt. Read this skill and its linked guidance yourself; native skill installation is optional. Explain the next useful step in plain language. Interpret feedback as evidence of a problem, not always as the right technical remedy.

## First: check permitted use

Read [the abstracted academic-use guide](references/academic-use.md) before opening teaching files. Establish submission status, material provenance and applicable tool restrictions using existing context. Ask only for missing facts that change eligibility. Ungraded submissions are not automatically exempt. Do not claim institutional approval or publish the original policy documents, personal details or local paths. This workflow is for independent ungraded use with own or permitted shareable material, outside graded submissions.

## Check your tools and carry the technical work

Check your actual ability to read the repository, work with files, run the chosen activity, test its visible behaviour and preserve the result. Inspect available capabilities before asking the user to choose a tool. A brand name or an ability to generate slides does not establish the ability to deploy a shared web application.

For university users, check existing institutional AI access before recommending a paid subscription. Prefer the Microsoft Copilot desktop app with university sign-in where the specific experience is permitted and capable. Verify the account's protection indicator, included features and any usage charges; do not equate Microsoft Copilot with GitHub Copilot. Desktop installation does not imply offline processing or institutional approval. Follow the [university setup guidance](references/tool-access.md#start-with-your-university-access).

Use direct file, code and browser tools where available. Computer use can operate permitted applications when needed. A tool with no native skill support can follow this file as instructions. Use [the tool-access guide](references/tool-access.md) if the user needs help choosing a route; verify current capabilities. If access is missing, explain the specific gap and recommend the simplest suitable setup; guide the user through enabling it or provide a compact handover brief for a capable agent. Do not turn that gap into a coding or cloud-administration assignment for the teacher. Do not claim to have run tests or deployed a service you could not access.

For nontechnical users, explain significant decisions as **recommendation, reason, cost, next action**. The user may need to log in, grant access or approve spending; they should not have to choose frameworks or type deployment commands. Request only the access needed. Never ask for passwords or secret keys in chat.

## Understand the presentation

Read the permitted material and notes. Summarise the central idea, likely misunderstandings and one or two places where participation could improve understanding. Ask the user to correct your interpretation. Preserve evidence, citations and distinctions between a real case, a fictional scenario and a modelling assumption.

Use context for audience, language, time, group size and presenter arrangement. Ask only for missing information that affects the design. Preserve the original and put the new activity in its own project folder. This repository is a reference; its two sides, four rounds, points, speaker count and hosting stack are not defaults for a different presentation.

## Explore and agree on a useful activity

Use [the activity-design guide](references/activity-design.md). For an open brief, compare two or three suitable approaches, recommend one and describe a concrete minute from the participant's perspective. Explain how it helps with a specific concept. Do not default to a game if prediction, sorting, annotation, a case or a simple visual would serve better.

Agree on the substantive teaching choice before a substantial build. Continue an already authorised design without reopening settled choices. Keep a short activity brief with the goal, placement, participant action, feedback, discussion, timing and operating needs. Mark unknowns and update the brief as feedback changes the design.

Every person needs a meaningful way to participate and an accessible alternative. A fictional role is optional. When roles are useful, show the goal and perspective beside the action, define repeatable roles if needed, and avoid stereotypes. Explain what an action changes. Any score, threshold or model variable must have a purpose and an understandable meaning. Label teaching assumptions and remove unused measures.

## Choose the simplest workable setup

Decide whether the activity needs one laptop, individual devices, shared live state, stored responses or internet access. A local visual or offline activity may be enough. Recommend hosting only when it serves the agreed design. Build locally while account access is being prepared.

When online or external participation is required, a working external link is part of delivery. Choose managed app hosting, static hosting for independent browser activities, or a small server as appropriate. A hyperscaler account is optional. Static hosting alone cannot aggregate live responses. Check sharing permissions, storage, expiry, idle behaviour and usage limits. Participants should not need the presenter's AI subscription. A localhost preview is not a completed online delivery; verify external access and shared state across separate clients where relevant.

When relevant, recommend Sol with High reasoning effort for the initial build and logic checks. Verify the model and setting in the user's actual tool; if unavailable, explain a capable alternative and its cost. Routine edits may need less effort. University access may avoid another subscription, but included chat does not guarantee included agent usage. A subscription around EUR 20 is a possible fallback budget, not a guarantee. See [model guidance](../../docs/MODELS.md).

Before paid hosting, check current prices, free-tier eligibility and the intended capacity. Explain compute, storage, public address, traffic, domain, backup and any AI API cost separately. Distinguish temporary credit from an ongoing allowance. Provide the concrete event cost, cost if left running and cleanup plan. Use deterministic code when that is sufficient; do not add a runtime AI dependency by habit.

Make the working result and exact proposed resources reviewable before requesting any still-needed spending or publishing approval. Existing authorisation remains valid. A repository or skill does not grant external-action permissions. The agent provisions and deploys within that scope, verifies the real service and gives the user its link. Do not modify unrelated services.

## Build one complete interaction

Implement the smallest meaningful action-feedback-discussion loop. Provide a preview the user can try with a short explanation of its controls. Clearly identify unfinished parts. Expand after checking that the interaction teaches what was intended.

Use the user's visual style, readable type, concise labels and purposeful diagrams. Put detail in speaker notes. Avoid text that merely describes the picture. Keep useful technical terms already taught; explain new ones naturally.

Provide separate teacher, audience, speaker and participant views only as needed. Keep private controls out of the projection. If joining is required, show an easily scanned code at the right moment and offer another way to join. Include a short skippable, reopenable walkthrough when controls need explaining; it must not create responses, advance the activity or reset state.

Notes must match the current content and phase: introduce the task, invite the action, interpret the actual result and return to the presentation. Use brief SAY / DO / NEXT cues where useful. Include transitions, pauses and participation time in estimates. Respect the agreed presenter arrangement; do not inherit the example's four speakers.

## Test, get feedback and iterate

Use [the rehearsal guide](references/rehearsal.md) selectively. Check the content and mechanics independently of the interface, then test the complete relevant flow. Use synthetic responses in separate test sessions. Test all small finite paths when feasible; otherwise test representative cases and explicit invariants. For shared state, cover incomplete responses, repeats, reconnects, authority boundaries and moving on when some people have not finished.

For non-game activities, check the appropriate behaviour: prediction and reveal order, ambiguous categories, annotation placement, branch reachability or correct simulation units. Do not impose voting, points or tie-breaking where they do not belong. Where a facilitator supplies missing input, label it honestly rather than presenting it as a participant response.

Ask the user to try a complete interaction. Check understanding as well as clicks: what did they notice and what can they now explain? Separate automated evidence from human judgement. Explain what passed, what remains untested and what the next revision should resolve.

Diagnose the user's feedback, recommend a small improvement, implement it and retest what changed. Reconsider the format if it does not serve the goal. Keep a working version. Update participant instructions, results, notes and any exports together; remove references to mechanics no longer present.

## Rehearse, hand over and preserve

Rehearse the full flow at a realistic pace on intended devices and network. Provide suitable offline materials, which may be a PDF, PowerPoint or paper fallback. Generate matching exports from current content where practical; check links, clipping, citations and notes. Label static examples. A static QR code must not pretend to join a future live session.

Hand over the working link or files, simple operating instructions, current notes, fallback, test evidence and remaining limits. Do not claim capacity, accessibility conformance or educational effectiveness solely from automated tests.

Help save reviewed code and teaching material in the user's GitHub account when authorised. Keep credentials, live responses and recovery archives private; inspect binary exports and history before public sharing. Explain how a future agent can restore or adapt the project. Reuse an existing small server only if compatible, with a verified backup and a rollback plan.

Offer an end-of-event reminder to save the project and stop hosting. Schedule it only when authorised and actually supported. The agent handles approved shutdown and checks the exact resources; a stopped VM may retain billable disks or addresses. Explain how to resume the activity later from saved files.
