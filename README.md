# PresentTogether

**Give your AI agent this repository link and the starter prompt below. It will guide you through the rest.**

You bring a presentation, subject knowledge and feedback. Together, you develop an activity that helps people understand the ideas by taking part. The agent writes the code, tests the result and handles hosting when needed. **You do not need to code or deploy anything.**

PresentTogether began with a wish to help teachers and students use AI to strengthen their own skills while creating more audience participation. The presenter practises designing and judging a learning experience; the audience gets to work with the ideas. The guide and reusable agent skill are the main product. The Singularity seminar is one worked example.

## Start here

Copy this into a capable coding agent, such as Codex, Claude Code or GitHub Copilot in VS Code. Claude Cowork and other tools can also be suitable if they have the required file, execution and testing access. The agent checks its actual tools and guides setup. [Which tools can do this?](skills/interactive-classroom-presentation/references/tool-access.md)

**University Copilot is not our recommended build route.** The university setup reported for this project cannot connect to GitHub or accept file uploads. We have withdrawn the earlier recommendation to start there. Choose a tool that can actually work with the project; a university login alone does not provide those capabilities. [Access check and alternatives](skills/interactive-classroom-presentation/references/tool-access.md#check-access-before-you-start)

```text
Use https://github.com/scaled-thinking/present-together as your guide.
Before asking for files, check that you can read this guide, work with project
files, run code and test the result. If access is missing, explain it first.
Read its interactive-classroom-presentation SKILL.md and follow its workflow.

Help me develop an interactive activity around my own presentation.
Check permitted use against the abstracted institution rules before reading my
teaching files. Guide me through any remaining setup.
Check whether a tool I already have can do the job before suggesting a paid plan.
Prefer Sol with High reasoning effort when available and permitted.

Analyse my material with me. Help clarify what the audience should learn,
compare suitable activities and recommend one. Use Singularity as inspiration
only. Build a small version, test it, and improve it with my feedback.

I am not technical. You handle code, testing and deployment. Explain the
important choices and costs simply. For an online activity, give participants
a working external link; choose suitable hosting, not necessarily a cloud VM.
Show me the working preview and cost before any still-needed approval.
Keep my originals, credentials and participant data safe. Explain how to use,
save, restore and stop the activity. Ask only what you need for the next step.
```

Your first message can include your audience, time and activity idea, if known. "Let's brainstorm" is enough. The agent checks permitted use and file access before asking for the presentation. If it cannot read GitHub but permitted local-file access works, use **Code > Download ZIP** and give it the extracted guide. If neither route works, choose a capable, permitted agent instead. No native skill installation is required.

> **Academic-use boundary:** this workflow is for ungraded, independent presentations using your own or permitted shareable material, outside graded submissions. Do not provide institutional teaching materials to external agents. An ungraded submission still counts as a submission. The skill applies an abstracted rules check first; it does not grant institutional approval. [Details](docs/ACADEMIC_USE.md)

## What happens together

| Step | What the agent does with you |
|---|---|
| **1. Check use and access** | Check the academic-use boundary and its own tools, then guide you through any needed setup. |
| **2. Understand the presentation** | Analyse the permitted material, identify difficult ideas and confirm the learning goal with you. |
| **3. Explore activities** | Compare suitable interactions, cases, simulations or games and explain what each person would do. |
| **4. Plan delivery** | Choose how people join, recommend a simple setup and explain costs. Hosting can be managed; a hyperscaler account is optional. |
| **5. Build and test** | Make one complete interaction and check the content, behaviour, controls and participant experience. |
| **6. Improve together** | Diagnose your feedback, revise the activity and retest. Keep the notes and presentation consistent. |
| **7. Rehearse and share** | Check timing and external access, deliver the working link or files and explain the controls. |
| **8. Save and stop hosting** | Preserve the project for reuse, keep private data separate and handle authorised cleanup after the event. |

**Try -> give feedback -> improve -> retest** is the central loop. Your feedback can be about what feels confusing; you do not need to prescribe a technical solution.

## Choose what serves the idea

A prediction can reveal a misconception. Sorting can clarify similar concepts. A visual can invite people to mark evidence. A branching case can make them reconsider a decision. A simulation or game can expose cause and effect or conflicting interests.

Roles, teams, scores and competition are options. Every person should know what to do and receive useful feedback. The discussion connects that experience to the presentation.

For online participation, people need a working external link. A local preview is only a development step. The agent checks the intended audience's access and, where needed, shared results. Participants should not need the presenter's AI subscription. [Hosting choices and costs](docs/HOSTING.md)

## Costs and reuse

Check whether a tool you already have supports the build before buying a subscription. Included university chat access is useful only for tasks it can actually perform. If you need a coding agent, a basic subscription around EUR 20/month may cover a small adaptation, depending on access and usage. [Model and cost guidance](docs/MODELS.md)

The Singularity example's former server had an estimated list price of **US$0.33/day**, before tax and traffic. Eligible allowances or trial credits can reduce the amount payable to zero. Other activities may use managed hosting, static hosting or a different setup. The agent checks current prices and limits before you commit. [Cost breakdown and saving to GitHub](docs/HOSTING.md)

## Read more or inspect the example

- [The beginner's guide](docs/START_HERE.md)
- [The agent skill](skills/interactive-classroom-presentation/SKILL.md)
- [Choosing an activity](skills/interactive-classroom-presentation/references/activity-design.md) and [rehearsing it](skills/interactive-classroom-presentation/references/rehearsal.md)
- [The Singularity example](docs/SINGULARITY_EXAMPLE.md), [PDF](presentation/Singularity_AI_2027.pdf) and [PowerPoint](presentation/Singularity_AI_2027.pptx)
- [Example code and checks](docs/DEVELOPMENT.md), [verification record](docs/VERIFICATION.md) and [security](SECURITY.md)

The original game server has been retired. GitHub stores the reusable project, not a maintained public game service.

Original code and teaching material use the [MIT licence](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md) for asset credits and source rights. A software licence does not override academic rules.
