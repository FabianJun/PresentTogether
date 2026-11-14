# From your presentation to an interactive activity

**Start by giving your agent the [repository link and starter prompt](../README.md#start-here). It reads the guide, checks its tools and leads you through the process. You do not write code or deploy anything.**

You bring the material and teaching judgement. The agent helps you explore, build and improve a way for people to take part. Codex, Cowork, GitHub Copilot and other capable tools can follow the workflow; the relevant capabilities matter more than the brand. [Tool guidance](../skills/interactive-classroom-presentation/references/tool-access.md)

The process is: **check permitted use -> provide -> analyse -> explore together -> plan access and costs -> build -> test -> get feedback -> iterate -> rehearse and use**.

This guide and the [agent skill](../skills/interactive-classroom-presentation/SKILL.md) are PresentTogether's core. Singularity is one example you can inspect for inspiration. Your activity is developed around your topic, audience, time and way of teaching.

## 0. Check permitted use before sharing files

The agent first checks an [abstracted institution rules guide](../skills/interactive-classroom-presentation/references/academic-use.md). It needs to know whether the work is assessed or submitted to the institution, and whether the material is your own and shareable. If that is already clear, it should proceed without asking again.

This workflow is for ungraded activities using your own shareable content, outside graded submissions. Do not provide institutional teaching materials to external agents. An ungraded submission can still be subject to institutional rules. If the intended use is unclear, describe it first and resolve the question before attaching your presentation. [Full academic-use note](ACADEMIC_USE.md)

## 1. Provide your presentation

After the initial use check, the agent asks for your permitted presentation. Tell it who will take part, how long you have and what you hope people will understand, if known. An activity idea is optional. "Let's brainstorm" is a useful starting point too.

The [starter prompt](../README.md#start-here) is the single entry point. You do not need to install a skill manually: the agent can read `SKILL.md` and its references. If it cannot open GitHub, use **Code > Download ZIP** and give it the extracted skill file. It should help you enable any missing access or carry the agreed brief to a suitable agent.

The agent handles programming, tests and deployment. You may need to sign in, grant access or approve a specific cost. It should not leave you with terminal commands or cloud-administration tasks to work out yourself.

A basic subscription around EUR 20 a month may cover a small adaptation; usage limits and revision time matter. A capable coding model such as Sol or Opus with High reasoning effort is a starting recommendation where available. Ask the agent to check the options in your tool and explain usage costs. [Model guidance](MODELS.md)

## 2. Analyse what the audience needs to understand

The agent should read your presentation before deciding what to build. Expect a short explanation of:

- The main idea and the parts that may be difficult for this audience.
- What someone should be able to explain or do afterwards.
- Where participation could help, linked to a particular slide or concept.

For example, a presentation about compound interest might benefit from a prediction before revealing a curve. A presentation about similar ethical concepts might benefit from comparing cases. Correct the agent's interpretation before it designs the activity.

It should preserve sources and distinguish evidence, examples and modelling assumptions. Your original presentation remains the reference, with proposed content changes made visible for review.

## 3. Explore activities together

Expect a few meaningfully different ideas and a recommendation. Each idea should explain what a participant actually does, what they see afterwards and how you will connect that experience to the topic.

| Possible activity | What a person does | What you can discuss afterwards |
|---|---|---|
| Predict and reveal | Predict an outcome, then see the evidence. | Which assumption led to the prediction? |
| Sort or rank | Put examples into categories or options in order. | Where did people disagree, and why? |
| Mark a visual | Identify a pattern, error or piece of evidence on a diagram. | What supports that interpretation? |
| Explore a simulation | Change an input and observe the result. | Which relationship changed, and what does the model leave out? |
| Work through a case | Make a decision, receive new information and reconsider. | What would justify a different choice? |
| Play a game | Act under rules, possibly with a role or limited resources. | How did the rules and incentives shape the choices? |

The format should fit your goal, time and audience. It may be one short interruption, several activities within the slides, or a separate exercise. Teams, competition and scores are added only if they help. Every participant needs a clear contribution; a fictional role is useful for some activities, but a clear task is enough for others.

Agree on a short activity brief: the learning goal, where it fits, what each person does, what they see afterwards, what you ask and how long it should take. The agent keeps this brief up to date as the design develops.

## 4. Plan the setup, access and costs

The agent should recommend the technical approach. You should not need to choose a framework, database or server configuration. It explains whether the activity needs individual devices, shared live results, saved responses or internet access.

For online participation, the result must have a link that works from outside the presenter's computer. The agent can choose managed hosting, static hosting for a suitable independent activity, or a small server for shared state. A hyperscaler account is optional. The local preview is not the finished online activity.

The agent checks that intended participants can join with the stated access requirements, ideally without accounts. If the activity combines their responses, it tests shared results across separate clients. It also explains any expiry, sleeping service, participant limit or usage charge that could interrupt the event.

If a hosting account is needed, the agent guides you through the provider's normal login and handles the technical setup. Do not paste passwords or secret keys into chat. It can build locally while cloud access is being prepared. It creates paid resources only within your authorisation for the specific setup and cost.

Ask for a plain explanation:

> What do I need? What will it cost for the event and if I leave it running for a month? Which costs are covered by an allowance or credit? How will I save, restore and stop it?

Before deployment, the agent should show you the working version and identify the resources it will use. [Hosting, credits and the example's daily cost](HOSTING.md)

## 5. Build one complete interaction

Try the smallest version that connects a participant's action to useful feedback: one prediction and reveal, one sorting exercise, one case decision, or one round if you chose a game.

The agent provides a preview link or file, shows you how to operate it, and identifies anything unfinished. Keep the new activity in its own project folder so the example remains available as a reference.

Check three things immediately: **What am I doing? Why does it matter? What happened after I acted?** If the activity uses roles, their perspectives should be visible beside the choices. Other formats need equally clear task instructions.

## 6. Test the activity and the teaching flow

Tests should fit the design. A simulation needs checked calculations and assumptions. A sorting activity needs sensible categories and explanations for ambiguous examples. A shared activity needs to handle incomplete responses, reconnection and moving on when someone has not finished.

The agent should show what passed, explain failures plainly and identify what still needs a person to try it. Synthetic participants belong in separate test sessions, never in real audience results.

Try the teacher and participant experiences yourself. If possible, ask someone unfamiliar with the topic to try one step. Check what they understood, as well as whether they could use the controls.

## 7. Give feedback and iterate

Your feedback can describe the experience. You do not have to prescribe a technical fix. The agent should diagnose the problem, recommend an improvement and explain how it helps.

| Your observation | What the agent should investigate |
|---|---|
| "I do not know what to do." | The task instruction, visible choices and first action. |
| "The result feels arbitrary." | The rule, evidence or calculation connecting action to result. |
| "People are tapping, but not learning." | Whether the action requires relevant thinking and whether the discussion uses it. |
| "I cannot lead this comfortably." | Teacher controls, notes, transitions and the amount to say. |
| "It is too complicated." | Which parts add learning value and which can be removed. |

Repeat **try -> explain the problem -> improve -> retest**. Keep a working version and change one important thing at a time. If the learning goal changes, revisit the activity choice.

The agent should explain its reasoning so you can judge future activities more confidently. It should keep the presentation, participant instructions and speaker notes in agreement after each revision.

## 8. Rehearse, use and save

Expand the tested small version into the agreed full flow. Rehearse at a realistic pace, including transitions, thinking time, participant actions and discussion. Shorten the activity or notes if it does not fit.

Expect a clear handover:

- Working files or a link, with an explanation of which view the audience sees.
- A short, skippable walkthrough of unfamiliar teacher controls, available again later.
- Current speaker notes for introducing the activity, responding to what happened and returning to the presentation.
- Suitable offline material, such as a PDF, PowerPoint or paper version.
- A test summary, limitations, operating instructions and a private backup where needed.

If hosting is needed, the agent deploys the reviewed version within your authorisation and checks the real link with you. It verifies the external link and shared state where needed. Try the actual audience devices and network before the event; a link working only on the presenter's laptop is not enough.

Save the code and teaching material to your own GitHub account if you want to reuse them. Store participant records and credentials separately. Set an end-of-event reminder to stop hosting; closing the browser does not stop a server. [Saving, switching activities and shutdown](HOSTING.md)

## Use the example when it helps

The [Singularity example](SINGULARITY_EXAMPLE.md) shows one way to connect roles, individual choices, consequences and a debrief. Its tests verify that particular implementation. A new activity needs its own design review, tests and rehearsal.

Borrow a useful pattern, adapt it to your own topic and audience, and check the resulting learning experience together.
