# A practical model choice

For designing the activity, implementing it and checking its rules, our starting recommendation is **Sol with High reasoning effort** in a capable agent. This gives the model more room to plan and check the work. It is our task recommendation, not a vendor default or a requirement to buy the largest model.

**Check university access first.** We recommend the Microsoft Copilot desktop app with your university account where permitted. The [setup guide](../skills/interactive-classroom-presentation/references/tool-access.md#start-with-your-university-access) explains account protection and access checks. Your existing licence may save you a separate subscription. Eligible Copilot Chat access is included at no extra cost, but Cowork and other advanced work can require additional licensing and usage credits. The agent must explain those costs before you enable paid usage. [Microsoft licensing](https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-licensing), [Cowork usage billing](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits/)

| Tool or provider | Example | Suggested starting setting |
|---|---|---|
| Microsoft Copilot Cowork | Sol, using the version available in your university account | Choose **Sol** in the model menu and **High** in the reasoning menu beside it. Availability depends on institutional settings. [Model and effort controls](https://learn.microsoft.com/en-us/copilot/cowork/cowork-models) |
| OpenAI | GPT-6.1 Sol in a coding agent that offers it | High reasoning effort. [Model details](https://developers.openai.com/api/docs/models/gpt-6.1-sol) |
| Anthropic | Claude Opus in an agent that offers it | High effort for the initial build and complex activity logic. Sonnet is another option when usage or speed matters. [Model comparison](https://platform.claude.com/docs/en/models/overview), [effort settings](https://platform.claude.com/docs/en/build-with-claude/effort) |

Reasoning effort is how much work the model can put into planning and checking. Higher effort may take longer and use more of your allowance. You can lower it for a small wording change. Leave maximum settings off unless the normal setup is struggling with a specific problem.

The agent should help you find the equivalent setting in your tool. If Sol or High is missing, it should explain the available alternative and any cost, rather than assume you need an upgrade. Available models and controls depend on the product, account and plan; an API model listing does not establish subscription access. [OpenAI's model-selection controls](https://learn.chatgpt.com/docs/models?surface=cli) explain this distinction.

Model names and prices change. These examples were checked on 14 November 2026. Ask your agent to verify the current options, access and cost before buying a plan. The included Singularity game does not run an AI model: the agent builds the application, then it runs on its own. A new activity should add runtime AI only when it serves a clear purpose, with its costs and behaviour checked separately.

Model choice and tool access are separate. Even a strong model needs file, execution and testing tools to build an application. [Compare suitable agent routes](../skills/interactive-classroom-presentation/references/tool-access.md); the agent should check its actual capabilities and guide the setup for you.
