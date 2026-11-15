# Your competence profile

You rate yourself in six areas. The agent uses each rating to choose how deeply to explain, and the profile grows with what you learn. It is a coaching aid, not an assessment or a grade. A self-rating is a starting point, not a test.

## Scale and coaching

| Level | Meaning | How the agent coaches in this area |
|---|---|---|
| 1 New | Has not met it yet | Explain fully once, with a concrete example from their own project. Check understanding with one question. Recommend; do not ask them to choose blind. |
| 2 Knows the terms | Has heard of it, not applied it | Short explanation plus the method's name. Offer options with a recommendation. |
| 3 Applies with support | Has used it with help | Name the method and give the reason in one line. Ask for their call before giving yours. |
| 4 Applies and judges | Uses it independently and can explain it | Name the method only. Let them lead, and invite them to challenge your proposal. |

Adapt per area, and fade support as the person shows the method. With no profile or no rating for an area, start at level 1 for the first explanation and fade as usual. "Shorter", "explain more" and "just do it" override the profile for the current session. The four "your view first" moments still apply at every level: give a starting hint at level 1 and ask more open questions at level 4.

## The six areas

These follow [the method cards](methods.md) and the [route](../SKILL.md#the-route). Each cell describes what the person can show at that level.

| Area | 1 New | 2 Knows the terms | 3 Applies with support | 4 Applies and judges |
|---|---|---|---|---|
| Core message and story | Asks how to turn a topic into one message. | Recognises a core message, And-But-Therefore, an opening and an ending when named. | With prompts, shapes one message into And-But-Therefore with an opening and ending. | Independently shapes the story and explains why its opening and ending serve the message. |
| Slides and visuals | Asks what makes a slide or chart clear. | Recognises cognitive load, assertion–evidence and contrast when named. | With help, reduces clutter, pairs a claim with evidence and improves charts and contrast. | Independently judges slides and charts and explains choices about load, evidence and contrast. |
| Explaining a hard idea | Asks how to make an unfamiliar idea understandable. | Recognises concreteness fading, analogies, prediction and pauses when named. | With help, moves from a concrete example to an abstract idea and uses an analogy, prediction or pause. | Independently chooses an explanation and explains where an analogy or other method could mislead. |
| Attention and taking part | Asks how to give the audience a meaningful action. | Recognises activity placement, retrieval, peer instruction and accessible alternatives when named. | With help, places an activity that needs thinking and offers an accessible way to take part. | Independently chooses and places an inclusive activity and explains why retrieval or peer instruction fits. |
| Feedback and iteration | Asks what to look for when trying the activity. | Names trying, noticing problems and improving as parts of iteration. | With help, links an observed problem to a cause, makes a small change and retests. | Independently diagnoses problems, chooses changes and explains whether the retest supports them. |
| Rehearsal and delivery | Asks how to prepare beyond reading the slides. | Recognises timing, speaking, handling questions and the activity brief as rehearsal aids. | With help, rehearses transitions, adjusts timing, practises questions and checks the activity brief. | Independently rehearses delivery, explains timing and question choices and keeps the activity brief useful. |

## Create it once, if wanted

At the first session without a profile, offer it once in one short question: "Rate each 1–4 (1 New, 2 Knows the terms, 3 Applies with support, 4 Applies and judges), or say skip: core message and story; slides and visuals; explaining a hard idea; attention and taking part; feedback and iteration; rehearsal and delivery?"

Keep within the first reply's three-question limit. If permitted use needs all three questions, offer the profile at the next natural pause; defer it whenever no question slot remains. Skipping never blocks work. Record supplied self-ratings as "set by the person"; leave other areas unrated.

## Local file format

Use one plain Markdown file, `~/.competence-profiles/presenttogether.md`, outside every repository. On Windows the folder is `%USERPROFILE%\.competence-profiles\`. Use this format with `PresentTogether` as the tool and one table row per rated area, using the area names above. Dates are `YYYY-MM-DD`; the entries below are format examples, not a real profile.

```markdown
# Competence profile: <tool>

Private. Stored only on this computer. Edit or delete it at any time.

| Area | Level | Last evidence | Updated |
|---|---|---|---|
| <area> | 2 | <one line of what the person showed> | 2026-11-15 |

## History

- 2026-11-15 · <area> · 1 → 2 · <evidence in one line> · confirmed
- 2026-11-15 · <area> · – → 3 · self-rating · set by the person
```

For a self-rating, use "self-rating" in Last evidence. On creation, say in one line where the file is and that the person can read, edit or delete it at any time. If you cannot write to the home directory, keep the profile in the conversation and offer its text so the person can save it themselves; never use the repository as a fallback.

## Update from learning progress

- Use what the person actually showed: a decision and its reason, a prediction with reasoning, a method named or applied without prompting, or a problem they diagnosed. Outcome luck and a right guess without reasoning do not count.
- After reflection, or when asked, propose each change as **area · old → new level · one line of evidence**. Propose at most one step per area per session. Levels can go down as well as up; explain a decrease plainly and kindly.
- Nothing changes without the person's yes; they may edit the proposal. Then update the table and append a history line marked "confirmed".
- The person may set any rating at any time, for example "set slides and visuals to 3". Record this as "set by the person" in the history.
- At the session's end, show progress in one or two lines: which areas moved since creation, taken from the history. Keep this in the conversation only.

## Keep it private

Only the coaching agent reads the profile. Never commit it, upload it, send it to another service or pass it to helpers, workers or sub-agents. Never copy or quote it into the talk, slides, activity brief, method card, project files, reports, logs, receipts, commit messages, issues or any shared file. The person can read, edit or delete the local file themselves, or ask the coaching agent to do it. It is not for grading and is shared with nobody unless the person chooses to share it.
