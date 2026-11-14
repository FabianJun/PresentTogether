import {activeModule,POLLS,ROUNDS,resolveRound,canContinueGame} from '../game.mjs';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const fail=(message,status=400,code)=>{throw Object.assign(Error(message),{status,code});};
const hash=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x)))).map(v=>v.toString(16).padStart(2,'0')).join('');
const id=()=>crypto.randomUUID()+crypto.randomUUID();
const roomCode=()=>Array.from(crypto.getRandomValues(new Uint8Array(6))).map(x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('');
async function body(req){if(Number(req.headers.get('content-length'))>8192)fail('Request too large',413);const text=await req.text();if(text.length>8192)fail('Request too large',413);try{return JSON.parse(text);}catch{fail('Invalid JSON');}}
export async function api(req,env){try{
 const url=new URL(req.url),path=url.pathname,db=env.DB;if(!db)fail('Live database is unavailable',503);
 if(req.method==='POST'&&req.headers.get('origin')&&req.headers.get('origin')!==url.origin)fail('Origin is not allowed',403);
 if(path==='/api/create'&&req.method==='POST'){
  // Bounded, automatic retention cleanup when a new seminar is created.
  const cut=Date.now()-7*86400000;
  await db.batch([db.prepare('DELETE FROM answers WHERE room IN (SELECT code FROM rooms WHERE created < ?)').bind(cut),db.prepare('DELETE FROM members WHERE room IN (SELECT code FROM rooms WHERE created < ?)').bind(cut),db.prepare('DELETE FROM rooms WHERE created < ?').bind(cut)]);
  const code=roomCode(),token=id();await db.prepare('INSERT INTO rooms(code,host_hash,created) VALUES(?,?,?)').bind(code,await hash(token),Date.now()).run();const presenters=[];for(let slot=1;slot<=4;slot++){const key=id();await db.prepare('INSERT INTO presenters(room,slot,label,token_hash) VALUES(?,?,?,?)').bind(code,slot,'Speaker '+slot,await hash(key)).run();presenters.push({slot,token:key});}return json({code,token,presenters},201);
 }
 const code=(url.searchParams.get('room')||'').toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code))fail('Enter a valid six-character room code');
 const room=await db.prepare('SELECT * FROM rooms WHERE code=? AND created>?').bind(code,Date.now()-7*86400000).first();if(!room)fail('Room not found or expired',404);
 const tokenHash=await hash(req.headers.get('authorization')?.replace(/^Bearer /,'')||''),isOwner=tokenHash===room.host_hash;
 const presenter=await db.prepare('SELECT slot,label FROM presenters WHERE room=? AND token_hash=?').bind(code,tokenHash).first(),isHost=isOwner||!!presenter;
 if(path==='/api/presenters'){
  if(!isHost)fail('Presenter access required',403);
  if(req.method==='GET'){if(presenter)await db.prepare('UPDATE presenters SET last_seen=? WHERE room=? AND slot=? AND last_seen<?').bind(Date.now(),code,presenter.slot,Date.now()-5000).run();const team=await db.prepare('SELECT slot,label,last_seen FROM presenters WHERE room=? ORDER BY slot').bind(code).all();return json({owner:isOwner,slot:presenter?.slot||0,active:room.active_speaker,team:[1,2,3,4].map(slot=>{const x=team.results.find(x=>x.slot===slot)||{slot,label:'Speaker '+slot,last_seen:0};return {...x,online:Date.now()-x.last_seen<20000};})});}
  if(req.method==='POST'){if(!isOwner)fail('Only the room owner can issue presenter links',403);const b=await body(req);if(!Number.isInteger(b.slot)||b.slot<1||b.slot>4)fail('Invalid speaker');const key=id();await db.prepare('INSERT INTO presenters(room,slot,label,token_hash) VALUES(?,?,?,?) ON CONFLICT(room,slot) DO UPDATE SET token_hash=excluded.token_hash,last_seen=0').bind(code,b.slot,'Speaker '+b.slot,await hash(key)).run();return json({slot:b.slot,token:key});}
 }
 if(path==='/api/state'&&req.method==='GET'){
  const counts=await db.prepare('SELECT team,COUNT(*) AS n FROM members WHERE room=? GROUP BY team').bind(code).all();
  const total=counts.results.reduce((n,x)=>n+x.n,0),module=activeModule(room);
  const answers=await db.prepare('SELECT module,value,COUNT(*) AS n FROM answers WHERE room=? GROUP BY module,value').bind(code).all();
  const polls={};for(const key of Object.keys(POLLS)){const canReveal=room.revealed&&module===key||key==='forecast'&&room.slide>0||key==='emotion'&&room.slide>1||key==='final'&&room.slide>10;polls[key]={n:answers.results.filter(x=>x.module===key).reduce((n,x)=>n+x.n,0),counts:canReveal?POLLS[key].options.map((_,i)=>answers.results.find(x=>x.module===key&&x.value===String(i))?.n||0):null};}
  const replies=await db.prepare('SELECT reply FROM answers WHERE room=? AND visible=1 AND length(reply)>0 ORDER BY rowid DESC LIMIT 6').bind(code).all();
  const history=JSON.parse(room.history);
  if(history.some(r=>r.teams.some(t=>!t.breakdown))){const rows=await db.prepare("SELECT a.module,m.team,a.value,COUNT(*) AS n FROM answers a JOIN members m ON m.id=a.member WHERE a.room=? AND a.module LIKE 'game%' GROUP BY a.module,m.team,a.value").bind(code).all();for(const r of history)for(const team of r.teams)if(!team.breakdown)team.breakdown=Object.fromEntries(['C','R'].map(value=>[value,rows.results.find(x=>x.module==='game'+r.index&&x.team===team.team&&x.value===value)?.n||0]));}
  let submitted=0;if(module)submitted=answers.results.filter(x=>x.module===module).reduce((n,x)=>n+x.n,0);
  const responseCounts=await db.prepare('SELECT m.team,COUNT(a.member) AS n FROM members m LEFT JOIN answers a ON a.member=m.id AND a.room=m.room AND a.module=? WHERE m.room=? GROUP BY m.team').bind(module||'',code).all();
  const participation=Object.fromEntries(['A','B'].map(team=>[team,{total:counts.results.find(x=>x.team===team)?.n||0,submitted:responseCounts.results.find(x=>x.team===team)?.n||0}]));
  return json({code,reset_version:room.reset_version,slide:room.slide,opened:!!room.opened,revealed:!!room.revealed,round:room.round,diagram_mode:room.diagram_mode,active_speaker:room.active_speaker,outcome_view:room.outcome_view,outcome_round:room.outcome_round,history,total,teams:counts.results,polls,replies:replies.results.map(x=>x.reply),submitted,module,participation});
 }
 if(path==='/api/join'&&req.method==='POST'){
  const b=await body(req);if(b.member){const exists=await db.prepare('SELECT id,team,role_id FROM members WHERE id=? AND room=?').bind(b.member,code).first();if(exists)return json({member:exists.id,team:exists.team,role:exists.role_id});}
  const count=await db.prepare('SELECT COUNT(*) AS n FROM members WHERE room=?').bind(code).first();if(count.n>=256)fail('This seminar is full',409);
  const member=id();await db.prepare("WITH seat AS (SELECT CASE WHEN COUNT(*) % 2=0 THEN 'A' ELSE 'B' END AS team FROM members WHERE room=?) INSERT INTO members(id,room,team,created,role_id) SELECT ?,?,seat.team,?,CASE (SELECT COUNT(*) FROM members WHERE room=? AND team=seat.team) WHEN 0 THEN 'government' WHEN 1 THEN 'lab' WHEN 2 THEN 'safety' WHEN 3 THEN 'public' ELSE 'undecided' END FROM seat").bind(code,member,code,Date.now(),code).run();const m=await db.prepare('SELECT team,role_id FROM members WHERE id=?').bind(member).first();return json({member,team:m.team,role:m.role_id},201);
 }
 if(path==='/api/answer'&&req.method==='POST'){
  const b=await body(req),m=await db.prepare('SELECT * FROM members WHERE id=? AND room=?').bind(b.member||'',code).first();if(!m)fail('Join this room first',403);
  const module=activeModule(room);if(!module||b.module!==module||!room.opened||room.revealed)fail('This round has closed. Your late answer was not counted. Wait for the next decision.',409,'ROUND_CLOSED');
  const value=String(b.value??''),policy='';
  if(module.startsWith('game')){if(!canContinueGame(JSON.parse(room.history)))fail('Earlier game rules: ask the moderator to choose Replay game.',409,'GAME_RULES_CHANGED');if(!['C','R'].includes(value))fail('Choose Cooperate or Race.');}
  else if(!POLLS[module]||!/^\d$/.test(value)||Number(value)>=POLLS[module].options.length)fail('Invalid option');
  // The write itself checks room state so answers cannot slip through after a reveal.
  const result=await db.prepare(`
   INSERT INTO answers(room,member,module,value,policy)
   SELECT ?,?,?,?,?
   WHERE EXISTS(SELECT 1 FROM rooms WHERE code=? AND opened=1 AND revealed=0 AND slide=? AND round=?)
   ON CONFLICT(room,member,module) DO UPDATE SET value=excluded.value,policy=excluded.policy
  `).bind(code,m.id,module,value,policy,code,room.slide,room.round).run();
  if(!result.meta.changes)fail('The decision has just closed',409);return json({ok:true});
 }
 if(path==='/api/moderation'&&req.method==='GET'){
  if(!isHost)fail('Presenter access required',403);const rows=await db.prepare('SELECT member,module,reply,visible FROM answers WHERE room=? AND length(reply)>0 ORDER BY rowid DESC LIMIT 100').bind(code).all();return json(rows.results);
 }
 if(path==='/api/export'&&req.method==='GET'){
  if(!isHost)fail('Presenter access required',403);const rows=await db.prepare('SELECT module,value,policy,reply,visible,team FROM answers a JOIN members m ON m.id=a.member WHERE a.room=?').bind(code).all();return json({code,history:JSON.parse(room.history),answers:rows.results,exported:new Date().toISOString()});
 }
 if(path==='/api/control'&&req.method==='POST'){
  if(!isOwner)fail('Only the moderator can control this presentation. Speaker links are read-only.',403);const b=await body(req);
  if(b.action==='diagram'){await db.prepare('UPDATE rooms SET diagram_mode=? WHERE code=?').bind(b.verified?1:0,code).run();}
  else if(b.action==='handoff'){if(!Number.isInteger(b.slot)||b.slot<1||b.slot>4)fail('Invalid speaker');await db.prepare('UPDATE rooms SET active_speaker=? WHERE code=?').bind(b.slot,code).run();}
  else if(b.action==='outcome'){
   const history=JSON.parse(room.history);if(!['live','round','summary'].includes(b.view))fail('Invalid result view');
   if(b.view==='round'&&(!Number.isInteger(b.round)||!history[b.round]))fail('This round has no result yet.',409,'RESULT_NOT_READY');
   if(b.view==='summary'&&history.length!==4)fail('The overall outcome is available after round 4.',409,'RESULT_NOT_READY');
   if(b.view==='live'&&(!room.opened||room.revealed))fail('Voting has closed. Choose a result to review.',409,'ROUND_CLOSED');
   await db.prepare('UPDATE rooms SET slide=9,outcome_view=?,outcome_round=? WHERE code=?').bind(b.view,b.view==='round'?b.round:-1,code).run();
  }
  else if(b.action==='slide'){if(!Number.isInteger(b.slide)||b.slide<0||b.slide>14)fail('Invalid slide');const resolvedGame=b.slide===9&&room.round>=0&&JSON.parse(room.history).length>room.round;await db.prepare('UPDATE rooms SET slide=?,opened=?,revealed=? WHERE code=?').bind(b.slide,resolvedGame?0:1,resolvedGame?1:0,code).run();}
  else if(b.action==='reveal'){
   if(activeModule(room)?.startsWith('game'))fail('Use Resolve round for the game');await db.prepare('UPDATE rooms SET opened=0,revealed=1 WHERE code=?').bind(code).run();
  }else if(b.action==='round'){
   if(!canContinueGame(JSON.parse(room.history)))fail('This game used earlier rules. Results are saved. Choose Replay game to start with 50 control and +15 for both cooperating.',409,'GAME_RULES_CHANGED');
   const history=JSON.parse(room.history);if(!Number.isInteger(b.round)||b.round!==history.length||b.round>3)fail('Resolve the current round before continuing',409);
   await db.prepare("UPDATE rooms SET slide=9,round=?,opened=1,revealed=0,outcome_view='live',outcome_round=-1 WHERE code=? AND history=?").bind(b.round,code,room.history).run();
  }else if(b.action==='resolve'||b.action==='advance'){
   if(!canContinueGame(JSON.parse(room.history)))fail('This game used earlier rules. Results are saved. Choose Replay game to start with 50 control and +15 for both cooperating.',409,'GAME_RULES_CHANGED');
   if(b.round!==undefined&&b.round!==room.round)fail('Another presenter has already changed the round. The current state has been refreshed.',409,'STALE_ROUND');
   if(room.round<0)fail('Start the game before closing a round.',409,'GAME_NOT_STARTED');
   if(room.revealed){
    if(b.action==='resolve')fail('This round has already been resolved.',409,'ROUND_ALREADY_RESOLVED');
    const changed=room.round<3?await db.prepare("UPDATE rooms SET slide=9,round=round+1,opened=1,revealed=0,outcome_view='live',outcome_round=-1 WHERE code=? AND round=? AND revealed=1 AND history=?").bind(code,room.round,room.history).run():await db.prepare('UPDATE rooms SET slide=10,opened=1,revealed=0 WHERE code=? AND round=3 AND revealed=1 AND history=?').bind(code,room.history).run();
    if(!changed.meta.changes)fail('Another presenter has already continued. The current state has been refreshed.',409,'STALE_ROUND');
    return json({ok:true});
   }
   if(room.round!==JSON.parse(room.history).length)fail('The round changed. Refresh the presentation before continuing.',409,'STALE_ROUND');
   const lock=await db.prepare('UPDATE rooms SET opened=0 WHERE code=? AND opened=1 AND revealed=0 AND round=? AND history=?').bind(code,room.round,room.history).run();if(!lock.meta.changes)fail('This round is already being closed. Please wait a moment.',409,'ROUND_BUSY');
   try{
    const votes=await db.prepare('SELECT value,policy,team,role_id FROM answers a JOIN members m ON m.id=a.member WHERE a.room=? AND module=?').bind(code,'game'+room.round).all();
    const history=JSON.parse(room.history),result=resolveRound(room.round,votes.results,history,{fallbacks:b.fallbacks});
    const members=await db.prepare('SELECT COUNT(*) AS n FROM members WHERE room=?').bind(code).first();
    result.participation={registered:members.n,submitted:votes.results.length,notSubmitted:members.n-votes.results.length};history.push(result);
    const next=b.action==='advance'&&room.round<3,changed=await db.prepare('UPDATE rooms SET history=?,slide=9,round=?,revealed=?,opened=?,outcome_view=?,outcome_round=? WHERE code=? AND history=? AND round=? AND opened=0 AND revealed=0').bind(JSON.stringify(history),next?room.round+1:room.round,next?0:1,next?1:0,next?'live':room.round===3?'summary':'round',next?-1:room.round,code,room.history,room.round).run();
    if(!changed.meta.changes)fail('The presentation changed while closing this round. Please retry from the current state.',409,'STALE_ROUND');
   }catch(e){await db.prepare('UPDATE rooms SET opened=1 WHERE code=? AND round=? AND history=? AND opened=0 AND revealed=0').bind(code,room.round,room.history).run();throw e;}
  }else if(b.action==='moderate'){await db.prepare('UPDATE answers SET visible=? WHERE room=? AND member=? AND module=?').bind(b.visible?1:0,code,String(b.member||''),String(b.module||'')).run();}
  else if(b.action==='reset'){
   if(b.confirmation!==code)fail('Type this room code to confirm the reset.',400,'RESET_CONFIRMATION_REQUIRED');
   if(!Number.isInteger(b.reset_version)||b.reset_version!==room.reset_version)fail('This room was already reset. Refresh before trying again.',409,'STALE_RESET');
   const reset=await db.batch([db.prepare('DELETE FROM answers WHERE room=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND reset_version=?)').bind(code,code,b.reset_version),db.prepare("UPDATE rooms SET slide=0,round=-1,history='[]',opened=1,revealed=0,diagram_mode=0,outcome_view='auto',outcome_round=-1,reset_version=reset_version+1 WHERE code=? AND reset_version=?").bind(code,b.reset_version)]);
   if(!reset[1].meta.changes)fail('This room was already reset. Refresh before trying again.',409,'STALE_RESET');
  }
  else if(b.action==='replay'){await db.batch([db.prepare("DELETE FROM answers WHERE room=? AND module LIKE 'game%'").bind(code),db.prepare("UPDATE rooms SET round=-1,history='[]',revealed=0,opened=1,slide=8,outcome_view='auto',outcome_round=-1 WHERE code=?").bind(code)]);}
  else if(b.action==='delete'){if(!isOwner)fail('Only the room owner can delete the seminar',403);await db.batch([db.prepare('DELETE FROM answers WHERE room=?').bind(code),db.prepare('DELETE FROM members WHERE room=?').bind(code),db.prepare('DELETE FROM presenters WHERE room=?').bind(code),db.prepare('DELETE FROM rooms WHERE code=?').bind(code)]);return json({deleted:true});}
  else fail('Unknown control action');return json({ok:true});
 }
 fail('Not found',404);
}catch(e){if(!e.status)console.error('API failure',e.message);return json({error:e.status?e.message:'The server could not complete this request. Please retry.',...(e.code?{code:e.code}:{}),...(e.missing?{missing:e.missing}:{}),...(e.ties?{ties:e.ties}:{})},e.status||500);}}
