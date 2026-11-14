# Make your presentation interactive, one step at a time

**Start with something you want people to understand. Bring the material you already have.**

Use this workflow only for **ungraded presentations made from your own shareable material**. Do not provide institutional teaching materials to external coding agents. An ungraded graded submission can still be subject to submission rules; this guide does not approve any tool for that use. [Academic-use boundary](ACADEMIC_USE.md)

You do not need to know how to build a website. You do need to check that the content is accurate, the activity makes sense, and the experience serves your students. An AI coding agent helps with implementation and can explain the work as you go.

The useful request is:

> Take my presentation. Let's work together on how to make it interactive, so people can experience the ideas as well as hear about them.

The goal is more than adding a quiz. A person can take a role, face a trade-off, make a choice, and see a consequence. That gives the explanation a personal meaning. You remain the teacher and author; the agent helps you explore and build.

## What you need

| You bring | What it is for |
|---|---|
| Your slides, notes, or other teaching material | The content and evidence the activity must stay connected to. |
| A learning goal | What participants should understand afterwards. One clear goal is enough to start. |
| A coding agent | An AI tool that can edit project files, run the app, and test it. A chat-only tool cannot do all of this. Choose any provider that supports that work. |
| This repository | A working reference. A repository is simply a project folder with a record of changes. |
| A cloud account, later | A small rented computer that keeps the game available to phones over the internet. You do not need this for the first local preview. |

A basic agent subscription around €20 per month may be enough for a small project. It is a starting budget, not a promise of unlimited work. Plans and usage limits vary. Ask the agent to explain when extra usage would cost money. As one price reference, [Claude's pricing page](https://claude.com/pricing) lists its own current plans; this project does not require that provider.

For this task, a practical starting point is **Sol or Opus with High reasoning effort**, where your coding tool offers it. Ask the agent to help select an appropriate model and explain its usage cost. You do not need the most expensive setting. [Model recommendations and current sources](MODELS.md)

## 1. Open the example with your agent

On the repository's GitHub page, choose **Code → Download ZIP**, then unzip it. Open the resulting folder in your coding agent. Alternatively, ask the agent to clone the repository for you.

Attach your presentation and paste the prompt below. Replace the bracketed details where you know them; the agent should help with the rest.

```text
Here is my presentation. Let's iterate together on how to make it interactive.

This is an ungraded activity using my own shareable content, not the institution teaching
material. If it is a graded submission, stop this external-agent workflow and
point me to the institution's current approved tools and AI tutor.

Audience: [who is in the room]
Learning goal: [what I want them to understand]
Time available: [presentation and activity time, if known]
Language: [language]
My activity idea: [idea, or "let's brainstorm"]

Read skills/interactive-classroom-presentation/SKILL.md in this repository.
Use the existing project as a reference, not as a fixed template for every topic.

I am not technical. Recommend sensible defaults instead of giving me a list
of technologies to choose from. Explain each important decision briefly:
what you recommend, why it helps, any cost, and what I need to do.
Ask me about teaching choices, not implementation details you can resolve.

First tell me what you understand from my slides. Suggest two simple ways
to make a key idea interactive and recommend one. Explain what each person
does, why the choice matters, and how we will discuss the result.
Let us agree on that learning activity before building it.

Then build a local preview and test it with simulated participants.
Make roles and choices immediately clear. Use short, natural language.
Explain assumptions in the simulation. Keep the slides and speaker notes
consistent. Show me the controls with a short, skippable walkthrough.

Keep my original material. Explain any content changes for my review.
Before publishing or creating paid resources, show the concrete result,
the hosting plan and expected costs, and ask for approval if not already given.
Never put secrets or real participant data in a public repository.
Help me save the reviewed project to my own GitHub account. Before the event,
help me set a reminder to back up the project and stop hosting afterwards.
```

If your tool has no skill feature, ask it to read that `SKILL.md` file as project instructions. A skill is just a reusable set of instructions; the teaching method is not tied to a particular AI provider.

## 2. Choose a small activity together

The agent should suggest a concrete experience, not ask you to design the software. For example:

> Each student advises one of two labs. They see a short role card and choose whether to keep safety checks or move faster. Both sides decide before seeing the other's choice. We then compare who gained an advantage with who carries the risk.

Check three things: does the choice connect to your topic, can everyone take part, and will the result give you something useful to discuss? If it needs a long explanation, simplify it before building.

You might say:

> The roles work, but there are too many decisions. Keep one meaningful choice per round. Show people what their choice means from their role's point of view.

## 3. Try one round before building the whole session

Ask the agent to start a local preview and give you its link. Local means it runs on your computer. It does not yet work on students' phones over the internet.

Try the teacher view and one participant view. Ask the agent to take the other roles in a **separate test session**, so real results stay untouched. Check whether you can tell who you are, what to do, and what happened without an explanation from the developer.

Useful feedback is specific:

> I cannot see why my side received those points. Show the choice, this round's points, and the total together. Keep the explanation short.

The agent should run the tests and explain failures plainly. Ask it to show the hardest cases too: a tie, a missing vote, a disconnected phone, or an empty side. Passing tests does not replace trying it yourself.

## 4. Prepare for the classroom

Ask for a full rehearsal with the expected class size and devices. Practise joining from a real phone, showing only the audience screen, revealing a result, moving on with missing responses, and recovering after a refresh.

Your handover should include:

- The teacher link and the separate audience link, with an explanation of which one to share.
- A short, skippable guide to the controls, available again later.
- Current speaker notes with round introductions, result explanations, and transitions.
- A PDF or PowerPoint and a simple offline way to run the activity.
- A clear test summary: what passed, what was tried by a person, and what is still untested.

This example has a **Quick guide** in the moderator console. [These operating instructions](RUN_A_SESSION.md) are the written version.

## 5. Put it online when you are ready

Tell the agent how long you need the site and roughly how many people will use it. Let it recommend the technical setup. You should not need to decide between databases, frameworks, or server configurations.

Before it creates anything, ask for this explanation:

> What will you create? What will it cost for the event and if I leave it running for a month? Which costs might fall outside the free allowance? How do I open, back up, and stop it?

An eligible cloud micro instance can be a low-cost option. Free allowances depend on region, disk type and account use; an internet address can be billed separately. [See the hosting guide and current provider sources.](HOSTING.md)

Your agent should ask you to sign in through the provider's normal login. Do not paste passwords or secret keys into a chat or a public file. Once deployed, test the public link and QR code from a phone on mobile data.

## 6. Keep what you learned

After the session, note where people hesitated and what the activity helped them understand. Adjust one thing at a time. Ask the agent to explain the connection between a change and its effect, so you can judge the next version yourself.

Save the presentation, source code, instructions and a private backup. The backup may contain access links and student responses; it belongs outside the public repository. Ask the agent to identify the exact resources to remove when hosting is no longer needed.

With your own GitHub account, you can keep each finished activity and ask the agent to put a different presentation on the same micro instance later. It should test the replacement, preserve the previous version and check the current free allowance. [Saving, switching and shutdown](HOSTING.md)
