# Which agents can do this?

**Start with the agent you have. Give it the repository link and starter prompt. It checks its tools and guides you from there.** You do not need to choose a programming language or learn deployment commands.

For a custom online activity, the agent needs to read and edit files, run code, test the interface, save the project and reach the chosen hosting service. A slide activity may need fewer tools. The same model in two different apps may have different access.

## Check access before you start

Start with a capable coding agent and check the actual session before buying anything or sharing teaching files. A local app with project-folder access can be convenient; installation alone does not guarantee the necessary tools or mean that processing stays on your computer.

1. **Read the guide.** Can the agent open this public repository or read a permitted local copy? A GitHub account connection is not required just to read public documentation.
2. **Work with files.** Can it read and edit a harmless sample in the project folder? Use a sample before providing permitted teaching material.
3. **Run and test.** Can it run a small preview and inspect the result? Text suggesting what the app would do is not evidence of a working app.
4. **Plan external access.** Can it handle the intended hosting, or identify the access it will need? It explains costs and obtains any still-needed authorisation before deployment.

The agent performs these checks and reports what worked. You should not need to run commands. Choose Sol with High reasoning effort where offered, or a suitable alternative, only after the tool can do the job. [Model guidance](../../../docs/MODELS.md)

## University Copilot limitation

The university Copilot setup reported by this project's maintainer cannot connect to GitHub or accept file uploads. We therefore withdrew the recommendation to use it as the starting build tool. This is a report about that setup, not a claim about every Copilot account; we have not independently inspected the university's configuration.

It may still support permitted general brainstorming. For the build, use a capable, permitted agent such as Codex, Claude Code or GitHub Copilot in VS Code, with the checks above. Do not assume a desktop installation, different model or paid upgrade fixes an institutional restriction. Do not route restricted files through a personal account or public upload to bypass it.

University sign-in and the data-protection indicator remain relevant when the institution permits Microsoft Copilot use. They establish neither build capability nor permission for other products. [Microsoft's account guidance](https://learn.microsoft.com/en-us/copilot/manage/manage-copilot-chat), [academic-use boundary](academic-use.md)

**Microsoft Copilot and GitHub Copilot are different products.** A university Microsoft login does not automatically grant GitHub Copilot access or make it an approved institutional tool.

## Suitable routes

This is a capability-based assessment from official documentation checked on 14 November 2026. We have not tested this repository end to end in every product. Availability, permissions and subscriptions vary.

| Tool | What makes it useful here | What the agent must check |
|---|---|---|
| **OpenAI Codex** | A coding-agent route for implementing, running and checking an activity in a project. | File, execution, browser and hosting access in the actual session. [Official coding workflow](https://learn.chatgpt.com/use-cases/browser-games) |
| **ChatGPT Work with Sites** | Can build, test and host web apps with a shareable address. | Sites availability, storage needs, sharing permissions and cost; it is managed hosting, not automatically your own micro VM. [Official app workflow](https://learn.chatgpt.com/use-cases/build-and-deploy-internal-apps) |
| **Claude Cowork or Claude Code** | Cowork can work with files and run code; computer use can operate permitted apps when direct tools are unavailable. | Access to the project, preview, tests and deployment. Desktop-dependent actions need the desktop app available. [Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork), [computer use](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork) |
| **GitHub Copilot in VS Code** | A coding-agent route with project files, tools and a browser for reviewing a web app. | A suitable agent session, execution/browser tools and access to the hosting account. Check its separate entitlement and institutional permission. [Official agent workflow](https://code.visualstudio.com/docs/agents/run/agents-window) |
| **Microsoft Copilot Cowork, if enabled** | A conditional option for accounts that provide the necessary file and agent tools. | The reported university setup is unsuitable. Other accounts must pass the access check; confirm licensing, usage credits and external sharing before choosing it. [Copilot app](https://support.microsoft.com/en-us/microsoft-365-copilot/what-is-microsoft-copilot-app) |
| **Microsoft 365 Copilot in PowerPoint** | Can help with slides and create interactions that people explore within a slide. | Whether that format fits the lesson. Microsoft documents that interactive-slide actions in Teams are not shared across participants; this alone does not establish support for a custom live multiplayer app. [Interactive slides](https://support.microsoft.com/en-us/powerpoint/copilot/create-interactive-slides-with-copilot-in-powerpoint) |

For a custom shared simulation, our starting recommendation is a coding agent with file, execution and browser tools. Cowork or managed app-building tools can also be suitable when they provide the required access. For a simpler interaction inside a presentation, existing presentation tools may be sufficient.

Computer use means the agent can operate an interface with mouse and keyboard. It is an access method, not a guarantee that every account, application or cloud action is available. Prefer direct tools when they do the job; check the result whichever method is used.

## What the agent does if something is missing

The agent identifies the missing capability and explains the simplest next step, such as opening a project folder, enabling a permitted tool or moving the brief to a capable agent. It preserves the agreed learning goal and design so you do not need to start again. A chat-only session can help plan, but should not claim to have built or tested an app without the tools to do so.

Downloading a ZIP is a fallback only if the agent can read the extracted files and that transfer is permitted. If both repository and file access are unavailable, explain the limitation and choose another permitted tool; do not keep asking for uploads or invent a workaround for an institutional restriction.

You may need to sign in to an account, grant specific access or approve a stated cost. The agent writes the code, runs the checks, performs the authorised deployment and explains how to use the result. Technical capability does not establish institutional permission: apply [the academic-use check](academic-use.md) first.
