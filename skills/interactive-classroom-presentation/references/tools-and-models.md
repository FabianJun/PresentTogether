# Tools and models

**Start with the agent you already have.** Give it the repository link and the starter prompt; it checks its own tools and guides you from there. You do not need to pick a programming language or learn deployment.

This is the only file in the guide that names specific products and models. Everything else is written for any capable agent. Product names, features and prices change quickly: the details below were checked on 14 November 2026. Ask your agent to confirm what is current before you buy anything.

## What the agent needs

Coaching on your message, story and activity ideas works in almost any AI chat. **Building** a custom online activity needs more: the agent must read and edit files, run code, test the result in a browser, save the project and, for online use, reach a hosting service. A slide-based activity may need less. The same model can have different tools in different apps.

## Check access before you start

The agent runs these checks itself, on a harmless sample, before it asks for your teaching files. It reports what worked. You should not have to run commands.

1. **Read the guide.** Can it open this public repository, or a permitted local copy? A GitHub account is not needed just to read public files.
2. **Work with files.** Can it create and edit a sample file in a project folder?
3. **Run and test.** Can it run a small preview and look at the result? Text describing what an app *would* do is not a working app.
4. **Plan external access.** Can it reach the intended hosting, or say exactly what access it will need? It explains any cost and gets your agreement first.

Installing a desktop app does not by itself guarantee these tools, and it does not mean your data stays on your computer.

### If something is missing

The agent names the missing capability and the simplest next step, such as opening a project folder, switching on a permitted tool or moving to a more capable agent. It keeps the agreed learning goal and design in [an activity brief](activity-brief-template.md) so you do not start again.

A chat-only session can still coach you and plan the activity; it should never claim to have built or tested something. If the agent cannot read GitHub but can read local files, download the repository as a ZIP (**Code > Download ZIP**) and give it the extracted folder, if that transfer is permitted. If neither works, choose another permitted tool rather than repeatedly trying uploads.

## Agents that suit the build

This is an assessment from official documentation, not an end-to-end test of this repository in every product. Availability, permissions and plans vary.

| Agent | Why it can suit this work | What to check |
|---|---|---|
| **ChatGPT Work with Sites** | Tools for building, testing and hosting web apps with a shareable address. | Availability, storage, sharing permissions and cost; this is managed hosting. [App workflow](https://learn.chatgpt.com/use-cases/build-and-deploy-internal-apps) |
| **Claude Code or Claude Cowork** | File and execution tools; permitted desktop-app access where available. | Access to the project, preview, tests and deployment. [Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork), [computer use](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork) |
| **Cursor** | A coding agent that reads `AGENTS.md` and Agent Skills. | The same four access checks. [Cursor skills](https://cursor.com/docs/context/skills) |
| **GitHub Copilot in VS Code** | Agent mode with project files, tools and a browser for checking a web app. | Run and browser tools, hosting access, your entitlement and any institutional permission. [Agent workflow](https://code.visualstudio.com/docs/agents/run/agents-window) |
| **Microsoft 365 Copilot in PowerPoint** | Slide support and interactions inside a slide. | Whether that format fits. Interactive-slide actions in Teams are not shared across participants, so this is not a live multiplayer app. [Interactive slides](https://support.microsoft.com/en-us/powerpoint/copilot/create-interactive-slides-with-copilot-in-powerpoint) |
| **Microsoft Copilot Cowork**, if enabled | An option for accounts that provide the necessary file and agent tools. | The access checks, licensing, usage credits and external sharing. [Copilot app](https://support.microsoft.com/en-us/microsoft-365-copilot/what-is-microsoft-copilot-app) |
| **OpenAI Codex** | A coding agent that can build, run and check an activity in a project. | File, run, browser and hosting access in your session. [Coding workflow](https://learn.chatgpt.com/use-cases/browser-games) |

Other coding agents that read `AGENTS.md` and Agent Skills can work too; the same four access checks apply.

For a custom shared activity, start with a coding agent that has file, run and browser tools. For a simple interaction inside a presentation, your presentation software may be enough.

"Computer use" means an agent operates an interface with mouse and keyboard. It is a way of accessing tools, not a guarantee that every account, app or cloud action is available. Prefer direct tools when they work, and check the result either way.

### Microsoft Copilot is not GitHub Copilot

They are different products. A Microsoft login from a school or university does not grant GitHub Copilot access or make it an approved tool. See [Microsoft's account guidance](https://learn.microsoft.com/en-us/copilot/manage/manage-copilot-chat). Check the available tools in the actual session and apply the owner's current institutional rules through [the general check](academic-use.md). Keep account-specific reports in the owner's own copy or outside this repository.

## How agents find the guide

You do not need to install anything: the starter prompt points the agent at the repository, and it reads `SKILL.md` and its references directly.

If you want the skill available in every project, copy the `skills/interactive-classroom-presentation` folder into your agent's skills folder. Common locations, checked on 14 November 2026:

| Agent | Project instructions | Skills folder |
|---|---|---|
| Claude Code | `CLAUDE.md`, or `AGENTS.md` when no `CLAUDE.md` exists | `.claude/skills/` |
| Cursor | `AGENTS.md` or `.cursor/rules/` | `.agents/skills/` or `.cursor/skills/` |
| Gemini CLI | `GEMINI.md` (`AGENTS.md` requires configuration) | `.agents/skills/` or `.gemini/skills/` |
| GitHub Copilot (VS Code and cloud agent) | `AGENTS.md` or `.github/copilot-instructions.md` | `.github/skills/` (`.agents/skills/` also supported by the cloud agent) |
| OpenAI Codex | `AGENTS.md` | `.agents/skills/` |

Sources: [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code memory](https://code.claude.com/docs/en/memory), [Claude Code skills](https://code.claude.com/docs/en/skills), [VS Code instructions](https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference), [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills), [GitHub cloud agent](https://docs.github.com/en/copilot/reference/custom-instructions-support), [Cursor rules](https://cursor.com/docs/context/rules), [Gemini CLI](https://geminicli.com/docs/cli/gemini-md/) and the [Agent Skills specification](https://agentskills.io/specification). The Gemini CLI documentation says it has been replaced by Antigravity CLI for unpaid-tier and Google One users; check the current tool for your account.

## Choosing a model

Tool access matters more than the model: even a strong model cannot build an app without file, run and test tools. Once the tools work, a model with strong reasoning helps most with the initial design, the build and checking the activity's rules.

| Provider | Example | Suggested starting setting |
|---|---|---|
| Anthropic | Claude Opus, in an agent that offers it | High effort for the first build and complex activity logic; Sonnet when speed or usage matters. [Models](https://platform.claude.com/docs/en/models/overview), [effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| Microsoft | Copilot Cowork, where the account provides the tools | Its documented model and reasoning controls; included chat access does not guarantee Cowork usage. [Model controls](https://learn.microsoft.com/en-us/copilot/cowork/cowork-models), [billing](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits/) |
| OpenAI | GPT-6.1 Sol, in a coding agent that offers it | High reasoning effort. [Model details](https://developers.openai.com/api/docs/models/gpt-6.1-sol) |

These are suggestions for this task, not vendor defaults. **Reasoning effort** is how much work the model may put into planning and checking. Higher effort takes longer and uses more of your allowance; lower it for small wording changes. Leave maximum settings off unless the normal setting struggles with a specific problem.

The agent helps you find the equivalent setting in your tool. If a suggested model is not available, it explains the alternative instead of assuming you need an upgrade. An API model listing does not mean your subscription includes it. [OpenAI's model-selection controls](https://learn.chatgpt.com/docs/models?surface=cli) explain this difference.

## Costs

First check whether a tool you already have can do the job. If you need a coding agent, a basic subscription of around EUR 20 a month may cover a small adaptation, depending on access and usage. Hosting costs are separate; see [hosting and costs](../../../docs/HOSTING.md).

The included Singularity game does not run an AI model at all: the agent builds the app, and the app then runs on its own. Add a runtime AI service to a new activity only when it serves a clear purpose, and check its cost and behaviour separately.

## Permission comes first

Technical capability is not institutional permission. Apply [the permitted-use check](academic-use.md) before sharing teaching material, whichever tool you use.
