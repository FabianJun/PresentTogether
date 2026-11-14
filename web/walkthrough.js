const steps = [
  ['This is your control screen', 'Only you change the shared slides and game rounds. Your audience sees a separate projection. This guide does not change the session.'],
  ['Show the audience screen', 'Choose Open projection. Move that window onto the projector or share only that window. Use Full screen or F11 to hide browser tabs and bookmarks. Keep this control screen private.'],
  ['Give speakers their notes', 'Choose 4 speakers and copy each private speaker link. Speakers can browse their own slides without moving the projection. Their pages also have a PDF download.'],
  ['Invite the class at the game', 'On slide 10, the lobby shows a large QR code. Let people join, then choose Start round 1. Each person sees their side, role and two choices. On a local preview, phones need a separately configured network or public deployment.'],
  ['Reveal, explain, continue', 'Choose Show round result, then Next round. Notes on the right follow each round and result. Missing individual votes do not block you. If an entire side has no votes, you can wait or make a clearly labelled moderator choice.'],
  ['Finish and save your work', 'After round 4, discuss the actual points and control score. Export results with the download button if needed. Reset requires confirmation. After your event, save your project and private backup, then stop hosting through your cloud account; closing this browser does not stop the server.']
];

export function setupWalkthrough() {
  const storageKey = 'singularity-presenter-guide-v1';
  const header = document.querySelector('.host-top .row');
  const help = document.createElement('button');
  help.id = 'quick-guide';
  help.textContent = 'Quick guide';
  header.append(help);
  const dialog = document.createElement('dialog');
  dialog.id = 'presenter-guide';
  dialog.setAttribute('aria-labelledby', 'guide-title');
  dialog.innerHTML = `<div class="guide-progress" aria-live="polite"></div><h2 id="guide-title"></h2><p id="guide-copy"></p><div class="guide-actions"><button id="guide-skip">Skip guide</button><div><button id="guide-back">Back</button><button id="guide-next" class="primary">Next</button></div></div>`;
  document.body.append(dialog);
  let step = 0;
  const render = () => {
    dialog.querySelector('.guide-progress').textContent = `QUICK GUIDE · ${step + 1} / ${steps.length}`;
    dialog.querySelector('#guide-title').textContent = steps[step][0];
    dialog.querySelector('#guide-copy').textContent = steps[step][1];
    dialog.querySelector('#guide-back').disabled = step === 0;
    dialog.querySelector('#guide-next').textContent = step === steps.length - 1 ? 'Ready to present' : 'Next';
  };
  const remember = () => { try { localStorage.setItem(storageKey, 'seen'); } catch {} };
  const close = () => { remember(); dialog.close(); help.focus(); };
  const open = () => { step = 0; render(); dialog.showModal(); dialog.querySelector('#guide-next').focus(); };
  help.onclick = open;
  dialog.querySelector('#guide-skip').onclick = close;
  dialog.querySelector('#guide-back').onclick = () => { if (step > 0) { step--; render(); } };
  dialog.querySelector('#guide-next').onclick = () => { if (step === steps.length - 1) close(); else { step++; render(); } };
  dialog.addEventListener('cancel', remember);
  let seen = false;
  try { seen = localStorage.getItem(storageKey) === 'seen'; } catch {}
  if (!seen) open();
}
