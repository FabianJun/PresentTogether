# Run a session

**Use the moderator console on your laptop. Show only the projection to the class.**

## Before the class

1. Open your deployed site and choose **Start a presentation**. On first use, a short guide opens. You can skip it and reopen it using **Quick guide**.
2. Choose **Open projection**. Move that window to the projector. Use its **Full screen** button or F11 to hide tabs and bookmarks. In a video call, share this window only.
3. Choose **4 speakers**. Give each speaker their own private link. They can browse their slides and notes independently and download their PDF. The owner link controls the session; keep it private.
4. Rehearse in a separate room. Use the actual phones and network when possible. Test the join code, not just a screenshot of it.

The local preview at `127.0.0.1` is on your computer only. For students to join over the internet, use the public address provided after [deployment](HOSTING.md).

## During the presentation

Use **Next slide** and the slide list to control the projection. Notes on the right show what to say and what to do. **Follow live** returns the notes to the current slide. Each speaker's private view stays within their own part; Speaker 3 can follow the game automatically.

The presentation has 15 slides. Speakers 1 and 2 cover slides 1–4 and 5–8. Speaker 3 explains the dilemma on slide 9 and leads the game on slide 10. Speaker 4 presents the solutions and conclusion on slides 11–12. Slides 13–15 are references.

## During the game

1. Open the game lobby on slide 10. This is when the large QR code appears. Students scan it, or open the site and enter the room code.
2. Choose **Start round 1**. Roles appear on participants' phones. Each person reads their perspective and chooses **Cooperate** or **Race** individually.
3. Choose **Show round result**. Both sides are revealed together. Explain their choices, points gained, totals and the change in control. Use the short result notes on the right.
4. Choose **Next round**. Repeat for 2025, 2026, 2027 and Transition. After the final reveal, discuss the actual result before handing over to Speaker 4.

You can show a result before everyone has voted. Missing individual votes are not counted. If a whole side has no votes, the app asks you to wait or choose for that side. Any such choice is labelled as a moderator decision; it is not presented as a student's vote. [Counting and scoring rules](GAME_RULES.md)

## If something goes wrong

| Situation | What to do |
|---|---|
| A phone loses connection | Refresh or reopen the same link in the same browser. A submitted choice is stored by the server. |
| Your notes show an earlier slide | Choose **Follow live**; in Speaker 3's view choose **Follow game**. |
| A request times out | Check the refreshed state before retrying. The action may already have completed. |
| You need to explain an earlier result | Use the result selector to review it. It does not take new votes. |
| You want a clean rehearsal | Use a new room, or **Reset this room's results…** and enter the room code to confirm. Reset keeps participant seats and private access links. |
| The internet fails | Use the PDF or PowerPoint. Collect paper C/R votes by side, apply the same rules, and record the scores yourself. Speaker 3's PDF includes this fallback. |

The walkthrough only explains the controls. It never casts votes, moves the projection or resets results.

## After the class

Export results using the download button if you need them. Keep them private. Save your code and presentation to your GitHub account, and save any live database backup separately.

**Remember to stop hosting after the event. Closing the browser does not stop the VM.** Set a calendar reminder when you book the presentation. Ask your agent to identify this app's resources and explain whether stopping or deleting them is appropriate. Disks and reserved addresses may still cost money while a VM is stopped. [Shutdown and reuse](HOSTING.md#after-the-presentation)
