# Which agents can do this?

**Start with the agent you have. Give it the repository link and starter prompt. It checks its tools and guides you from there.** You do not need to choose a programming language or learn deployment commands.

For a custom online activity, the agent needs to read and edit files, run code, test the interface, save the project and reach the chosen hosting service. A slide activity may need fewer tools. The same model in two different apps may have different access.

## Suitable routes

This is a capability-based assessment from official documentation checked on 14 November 2026. We have not tested this repository end to end in every product. Availability, permissions and subscriptions vary.

| Tool | What makes it useful here | What the agent must check |
|---|---|---|
| **OpenAI Codex** | A coding-agent route for implementing, running and checking an activity in a project. | File, execution, browser and hosting access in the actual session. [Official coding workflow](https://learn.chatgpt.com/use-cases/browser-games) |
| **ChatGPT Work with Sites** | Can build, test and host web apps with a shareable address. | Sites availability, storage needs, sharing permissions and cost; it is managed hosting, not automatically your own micro VM. [Official app workflow](https://learn.chatgpt.com/use-cases/build-and-deploy-internal-apps) |
| **Claude Cowork or Claude Code** | Cowork can work with files and run code; computer use can operate permitted apps when direct tools are unavailable. | Access to the project, preview, tests and deployment. Desktop-dependent actions need the desktop app available. [Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork), [computer use](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork) |
| **GitHub Copilot in VS Code** | A coding-agent route with project files, tools and a browser for reviewing a web app. | A suitable agent session, execution/browser tools and access to the hosting account. This is different from Microsoft 365 Copilot. [Official agent workflow](https://code.visualstudio.com/docs/agents/run/agents-window) |
| **Microsoft 365 Copilot in PowerPoint** | Can help with slides and create interactions that people explore within a slide. | Whether that format fits the lesson. Microsoft documents that interactive-slide actions in Teams are not shared across participants; this alone does not establish support for a custom live multiplayer app. [Interactive slides](https://support.microsoft.com/en-us/powerpoint/copilot/create-interactive-slides-with-copilot-in-powerpoint) |

For a custom shared simulation, our starting recommendation is a coding agent with file, execution and browser tools. Cowork or managed app-building tools can also be suitable when they provide the required access. For a simpler interaction inside a presentation, existing presentation tools may be sufficient.

Computer use means the agent can operate an interface with mouse and keyboard. It is an access method, not a guarantee that every account, application or cloud action is available. Prefer direct tools when they do the job; check the result whichever method is used.

## What the agent does if something is missing

The agent identifies the missing capability and explains the simplest next step, such as opening a project folder, enabling a permitted tool or moving the brief to a capable agent. It preserves the agreed learning goal and design so you do not need to start again. A chat-only session can help plan, but should not claim to have built or tested an app without the tools to do so.

You may need to sign in to an account, grant specific access or approve a stated cost. The agent writes the code, runs the checks, performs the authorised deployment and explains how to use the result. Technical capability does not establish institutional permission: apply [the academic-use check](academic-use.md) first.
