import {gameNotes} from '/game-notes.js';
export async function openSpeaker({app,code,deck,slideArt,initialState,esc,request}){
 const info=await request('/api/presenters',undefined,true);
 if(!info.slot||info.owner)throw Error('Open the private link for your speaker seat.');
 const slot=info.slot,ids=deck.map((s,i)=>s.speaker===slot&&i<12?i:null).filter(i=>i!==null),memory='control-speaker-slide-v2-'+code+'-'+slot;
 let index=Number(localStorage.getItem(memory));if(!ids.includes(index))index=ids[0];
 let liveGame=null,followGame=slot===3,rendered='',syncing=false;
 const duration=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
 app.innerHTML=`<div class="speaker-view"><header class="speaker-header"><a href="/" class="wordmark">SINGULARITY<i></i></a><span>Speaker ${slot}</span><a class="btn" href="/assets/Speaker_${slot}_V9.pdf?v=public-v1" download>Download my PDF ↓</a></header><div class="speaker-progress"><span id="speaker-position"></span><span id="speaker-connection" role="status">Private notes</span>${slot===3?'<button id="speaker-follow-game" aria-pressed="true">Following game</button>':''}</div><nav class="speaker-own-slides" aria-label="My slides">${ids.map(i=>`<button data-own-slide="${i}">${String(i+1).padStart(2,'0')} · ${esc(deck[i].title)}</button>`).join('')}</nav><div class="speaker-layout"><section><div id="speaker-art" class="speaker-art"></div><div class="speaker-navigation"><button id="speaker-prev">← Previous</button><button class="primary" id="speaker-next">Next in my part →</button></div><p class="speaker-guidance">Your navigation changes only your notes. The moderator controls the shared screen.${slot===3?' Following game updates your round introductions and result notes automatically.':''}</p></section><section class="speaker-script"><span id="speaker-timing" class="eyebrow"></span><p id="speaker-game-status" class="speaker-game-status" hidden></p><h1 id="speaker-title"></h1><h2>SAY</h2><div id="speaker-say"></div><h2>DO</h2><p id="speaker-do"></p><div id="speaker-rounds"></div><h2>NEXT</h2><p id="speaker-handover"></p><details><summary>Sources</summary><div id="speaker-sources"></div></details></section></div></div>`;
 function render(){
  const s=deck[index],at=ids.indexOf(index),cue=index===9&&liveGame?gameNotes(deck,liveGame):null,content=cue||{script:s.script,delivery:s.delivery,transition:s.transition};
  const signature=JSON.stringify([index,content,index===9?liveGame:null]);if(signature===rendered)return;rendered=signature;
  localStorage.setItem(memory,String(index));
  app.querySelector('#speaker-position').textContent=`My slide ${at+1} of ${ids.length} · Presentation slide ${index+1}`;
  app.querySelector('#speaker-art').innerHTML=slideArt(index,index===9&&liveGame?liveGame:initialState(index));
  app.querySelector('#speaker-title').textContent=s.title;
  app.querySelector('#speaker-timing').textContent=duration(s.seconds)+(index===8||index===9?' · Activity':' · Talk');
  const status=app.querySelector('#speaker-game-status');status.hidden=!cue;status.textContent=cue?.label||'';status.dataset.phase=cue?.phase||'';
  app.querySelector('#speaker-say').innerHTML=content.script.split(/\n\n/).map(t=>'<p>'+esc(t)+'</p>').join('');
  app.querySelector('#speaker-do').textContent=content.delivery;app.querySelector('#speaker-handover').textContent=content.transition;
  app.querySelector('#speaker-sources').innerHTML=s.sources.map(x=>'<p><a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.apa||x.title)+'</a></p>').join('');
  app.querySelector('#speaker-rounds').innerHTML='';
  app.querySelector('#speaker-prev').disabled=at===0;app.querySelector('#speaker-next').disabled=at===ids.length-1;
  app.querySelectorAll('[data-own-slide]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ownSlide)===index));
 }
 function followButton(){const b=app.querySelector('#speaker-follow-game');if(b){b.textContent=followGame?'Following game':'Follow game';b.setAttribute('aria-pressed',String(followGame));}}
 function select(next){index=next;followGame=false;followButton();render();}
 function move(direction){select(ids[Math.max(0,Math.min(ids.length-1,ids.indexOf(index)+direction))]);}
 app.querySelector('#speaker-prev').onclick=()=>move(-1);app.querySelector('#speaker-next').onclick=()=>move(1);
 app.querySelectorAll('[data-own-slide]').forEach(b=>b.onclick=()=>select(Number(b.dataset.ownSlide)));
 document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
 async function syncGame(){if(slot!==3||syncing)return;syncing=true;try{
  const state=await request('/api/state');if(state.slide===9){liveGame=state;if(followGame)index=9;render();}
  else if(state.round<0&&!state.history.length&&liveGame){liveGame=null;render();}
  app.querySelector('#speaker-connection').textContent='Connected';
 }catch{app.querySelector('#speaker-connection').textContent='Offline · showing last received notes';}finally{syncing=false;}}
 const follow=app.querySelector('#speaker-follow-game');if(follow)follow.onclick=()=>{followGame=true;followButton();if(liveGame){index=9;render();}syncGame();};
 async function heartbeat(){try{await request('/api/presenters',undefined,true);if(slot!==3)app.querySelector('#speaker-connection').textContent='Connected';}catch{app.querySelector('#speaker-connection').textContent='Offline · your loaded notes still work';}}
 render();heartbeat();setInterval(heartbeat,15000);if(slot===3){syncGame();setInterval(syncGame,1500);}
}
