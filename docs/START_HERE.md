# What to expect, step by step

**Give your AI agent the [repository link and starter prompt](../README.md#start-here). It reads this guide, checks its own tools and leads you from there. You never need to write code or deploy anything.**

This page is for teachers and students who want to know what will happen. You do not need to read it before you start.

## How the agent works with you

The agent is a coach who also builds. It does the technical work. On teaching, presenting and storytelling, it explains and suggests; you decide.

- **It names its methods.** When it suggests a change, it tells you what the method is called, why it works, how to use it and when it does not fit. The methods come from research on learning and presenting, summarised in [the method cards](../skills/interactive-classroom-presentation/references/methods.md).
- **It asks for your view first, but rarely.** At four moments it asks what you think before giving its own view: your core message, where the audience may struggle, your first activity idea and your verdict on the first version. Otherwise it gets on with the work.
- **You control the depth.** Say "shorter" for less explanation, "explain more" for more, or "just do it" when you want results without the lesson.
- **Your voice stays yours.** It suggests changes as before/after; you choose. If your course requires independent work, that part stays yours.

## Your competence profile

You can rate yourself in six areas so the agent knows how deeply to explain. It offers this once; skipping never holds up your talk.

- **Core message and story:** one core message, And-But-Therefore, opening and ending.
- **Slides and visuals:** cognitive load, assertion–evidence, charts and contrast.
- **Explaining a hard idea:** moving from concrete examples to abstract ideas, analogies, prediction and pauses.
- **Attention and taking part:** activity design and placement, recalling ideas, discussing answers with peers and accessibility.
- **Feedback and iteration:** trying it, noticing what goes wrong and improving it.
- **Rehearsal and delivery:** timing, speaking, handling questions and the activity brief.

Use the same scale for each area:

- **1 New:** you have not met it yet; the agent explains fully once, uses your project as an example and checks understanding with one question.
- **2 Knows the terms:** you have heard of it but not applied it; the agent gives a short explanation, names the method and recommends an option.
- **3 Applies with support:** you have used it with help; the agent names the method, gives a one-line reason and asks for your call first.
- **4 Applies and judges:** you use it independently and can explain it; the agent names the method, lets you lead and invites you to challenge its proposal.

Each area gets its own depth; "shorter", "explain more" and "just do it" still win for the session. Without a rating, the agent starts with a full first explanation and reduces support as you show the method.

The profile lives only on your computer at `~/.competence-profiles/presenttogether.md` (Windows folder: `%USERPROFILE%\.competence-profiles\`), outside every repository. At reflection, the agent proposes updates with the area, old → new level and one line of evidence from what you showed. Each proposal moves at most one step per area per session, up or down, and is applied only with your yes. It then shows progress in one or two lines.

You can read, edit or delete the file at any time, or ask the coaching agent to do it; you can also set any rating yourself. If the agent cannot save it there, it keeps it in the conversation and offers text you can save. Only the coaching agent reads it: it never goes into your talk, slides, activity brief, method card, logs or shared files, or to another service or helper. It is not for grading and is shared with nobody unless you choose. [Full profile rules](../skills/interactive-classroom-presentation/references/competence-profile.md)

## The route

1. **Check permitted use.** Before it reads any teaching file, the agent checks that you may use the material with it. It asks at most three short questions, and none if you have already said enough. Its first reply never asks more than three questions in total. [Why this matters](ACADEMIC_USE.md)
2. **Understand your talk.** It asks for your core message in one sentence (or repeats it back if you already gave it). Then it reads your material, asks where you think the audience will struggle, and sketches the story, the places where attention may drop and the idea the audience is most likely to misunderstand.
3. **Improve the talk, if you want.** It offers three to five changes with the biggest effect, such as a sharper opening, one idea per slide or a clearer example, each with the reason behind it.
4. **Find an activity.** It asks for your idea first. Then it shows three clearly different options: a safe one, an unusual one and one without technology. For each, it describes one minute from a participant's point of view and recommends one.
5. **Plan the setup and cost.** It picks the simplest setup that works, from paper to a shared live link, and tells you the cost before anything is paid. [Hosting and costs](HOSTING.md)
6. **Build one complete interaction.** You get a working preview of one step, with a short explanation of the controls and speaker notes that link the activity back to your talk.
7. **Try it and improve it.** You try it and say what you noticed. You do not need to suggest a technical fix: "people won't know what to do" is enough. It finds the cause, makes a small change and tests again.
8. **Rehearse and hand over.** It checks timing, the real link on real devices and an offline fallback such as a PDF or paper version. You get the link or files, short instructions and notes.
9. **Reflect.** Two or three short questions, one at a time, then a personal method card with the methods you used, in your own words, ready for your next talk. If you would rather skip the questions, the agent drafts the card and you edit it.

The agent tells you which step you are in and skips steps you do not need. It keeps a short activity brief in your project folder, so you or another agent can pick up where you left off.

## What you might be asked to do

- Sign in to an account through the provider's own page. Never paste passwords or secret keys into the chat.
- Agree to a specific cost before anything is paid for.
- Try the activity yourself and, if possible, with someone new to the topic.

You should never be left with terminal commands, cloud settings or code to fix. If the agent cannot do something with its current tools, it tells you plainly and suggests the simplest way forward. [Which tools can do this?](../skills/interactive-classroom-presentation/references/tools-and-models.md)

## Feedback that helps

Describe what you experienced; the agent works out the cause.

| You notice | The agent looks at |
|---|---|
| "I don't know what to do." | The instruction, the visible choices and the first action. |
| "The result feels random." | The rule or calculation that links an action to its result. |
| "People are tapping but not learning." | Whether the action needs real thinking, and whether the discussion uses it. |
| "I can't lead this comfortably." | Presenter controls, notes and transitions. |
| "It's too complicated." | Which parts add learning value and which can go. |

## After the event

Save the project to your own code-hosting account if you want to reuse it; the agent can do this for you. Participant data and passwords are kept out of it. Closing the browser does not stop hosting, so ask the agent for a reminder to stop it. [Saving, reusing and stopping](HOSTING.md)

## The included example

The [Singularity seminar](SINGULARITY_EXAMPLE.md) is one worked example: a game with roles, choices and a debrief. Borrow its patterns when they help. Its teams, rounds and scores were choices for that seminar, not a template for yours.
