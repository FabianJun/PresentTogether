import test from 'node:test';import assert from 'node:assert/strict';
import {api} from '../worker/api.mjs';import {openDatabase} from '../server/database.mjs';
async function setup(count=5){
 const db=openDatabase();
 async function call(path,data,token,code=''){
  const response=await api(new Request('https://test.local'+path+(code?'?room='+code:''),{method:data===undefined?'GET':'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},...(data===undefined?{}:{body:JSON.stringify(data)})}),{DB:db.DB});
  return {status:response.status,...await response.json()};
 }
 const room=await call('/api/create',{}),members=[];
 const request=(path,data,token)=>call(path,data,token,room.code);
 const control=data=>request('/api/control',data,room.token);
 for(let i=0;i<count;i++)members.push(await request('/api/join',{}));
 await control({action:'round',round:0});
 const vote=(member,round=0)=>request('/api/answer',{member:member.member,module:'game'+round,value:'C'});
 return {db,room,members,request,control,vote};
}

test('Joining alternates A/B and gives each bloc four unique seats followed by council members',async()=>{
 const x=await setup(12);try{
  assert.deepEqual(x.members.map(m=>m.team),Array.from({length:12},(_,i)=>i%2?'B':'A'));
  for(const team of ['A','B'])assert.deepEqual(x.members.filter(m=>m.team===team).map(m=>m.role),['government','lab','safety','public','undecided','undecided']);
  const before=(await x.request('/api/state')).total;
  for(const m of x.members){const again=await x.request('/api/join',{member:m.member});assert.equal(again.team,m.team);assert.equal(again.role,m.role);}
  assert.equal((await x.request('/api/state')).total,before);
 }finally{x.db.close();}
});

test('Government breaks strategy ties but cannot override a clear majority',async()=>{
 const x=await setup(6);try{
  await x.vote(x.members[0]);await x.request('/api/answer',{member:x.members[2].member,module:'game0',value:'R'});await x.vote(x.members[1]);
  assert.equal((await x.control({action:'resolve',round:0})).status,200);
  let s=await x.request('/api/state');assert.equal(s.history[0].teams[0].move,'C');assert.equal(s.history[0].teams[0].tieBreak.move,'government');
  await x.control({action:'advance',round:0});
  await x.vote(x.members[0],1);
  for(const i of [2,4])await x.request('/api/answer',{member:x.members[i].member,module:'game1',value:'R'});
  await x.vote(x.members[1],1);await x.control({action:'resolve',round:1});s=await x.request('/api/state');assert.equal(s.history[1].teams[0].move,'R');assert.deepEqual(s.history[1].teams[0].tieBreak,{});
  assert.equal('policy' in s.history[1].teams[0],false);
 }finally{x.db.close();}
});

test('Absent government in a tied strategy automatically uses Race and preserves actual votes',async()=>{
 const x=await setup(6);try{
  await x.vote(x.members[2]);await x.request('/api/answer',{member:x.members[4].member,module:'game0',value:'R',policy:'pledge'});await x.vote(x.members[1]);
  assert.equal((await x.control({action:'resolve',round:0})).status,200);
  const s=await x.request('/api/state'),a=s.history[0].teams[0];assert.equal(a.move,'R');assert.equal(a.votes,2);assert.deepEqual(a.breakdown,{C:1,R:1});assert.equal(a.tieBreak.move,'default');assert.equal(s.history[0].participation.submitted,3);assert.equal((await x.db.DB.prepare('SELECT COUNT(*) AS n FROM answers').first()).n,3);
 }finally{x.db.close();}
});

test('Close and continue with two received votes out of five; reject late answers',async()=>{
 const x=await setup();try{
  await x.vote(x.members[0]);await x.vote(x.members[1]);
  const s=await x.request('/api/state');assert.deepEqual(s.participation,{A:{total:3,submitted:1},B:{total:2,submitted:1}});
  assert.equal((await x.control({action:'advance',round:0})).status,200);
  const after=await x.request('/api/state');assert.equal(after.round,1);assert.equal(after.history.length,1);assert.equal(after.opened,true);
  assert.deepEqual(after.history[0].participation,{registered:5,submitted:2,notSubmitted:3});
  assert.equal((await x.vote(x.members[2])).code,'ROUND_CLOSED');
 }finally{x.db.close();}
});
test('Missing bloc returns an actionable error and reopens voting; explicit fallback adds no votes',async()=>{
 const x=await setup(3);try{
  await x.vote(x.members[0]);
  const missing=await x.control({action:'resolve',round:0});assert.equal(missing.status,409);assert.equal(missing.code,'MISSING_BLOC_DECISIONS');assert.deepEqual(missing.missing,['B']);
  assert.equal((await x.request('/api/state')).opened,true);
  const bad=await x.control({action:'advance',round:0,fallbacks:{B:{move:'invalid'}}});assert.equal(bad.status,400);assert.equal((await x.request('/api/state')).opened,true);
  assert.equal((await x.control({action:'resolve',round:0,fallbacks:{B:{move:'R'}}})).status,200);
  const s=await x.request('/api/state');assert.equal(s.history[0].teams[1].source,'moderator');assert.equal(s.history[0].teams[1].votes,0);assert.equal(s.history[0].participation.submitted,1);assert.deepEqual(s.history[0].moderatedBlocs,['B']);
  assert.equal((await x.db.DB.prepare('SELECT COUNT(*) AS n FROM answers').first()).n,1);
 }finally{x.db.close();}
});
test('Two presenters cannot advance the same round twice',async()=>{
 const x=await setup(2);try{
  await x.vote(x.members[0]);await x.vote(x.members[1]);
  const responses=await Promise.all([x.control({action:'advance',round:0}),x.control({action:'advance',round:0})]);assert.deepEqual(responses.map(x=>x.status).sort(),[200,409]);
  const s=await x.request('/api/state');assert.equal(s.round,1);assert.equal(s.history.length,1);
  assert.equal((await x.control({action:'advance',round:0})).code,'STALE_ROUND');
 }finally{x.db.close();}
});
test('A full round can be closed with labelled moderator choices, then hand over directly to solutions without a poll',async()=>{
 const x=await setup(0);try{
  for(const round of [0,1,2,3]){
   assert.equal((await x.control({action:'resolve',round,fallbacks:{A:{move:'C'},B:{move:'C'}}})).status,200);
   const s=await x.request('/api/state');assert.equal(s.history.length,round+1);assert.equal(s.revealed,true);
   assert.equal((await x.control({action:'advance',round})).status,200);
  }
  const s=await x.request('/api/state');assert.equal(s.slide,10);assert.equal(s.history[3].ending.kind,'ordered');assert.equal(s.history[3].teams[0].votes,0);
  assert.equal((await x.control({action:'outcome',view:'round',round:0})).status,200);const reviewed=await x.request('/api/state');assert.equal(reviewed.round,3);assert.equal(reviewed.outcome_round,0);assert.equal(reviewed.history.length,4);
  assert.equal((await x.control({action:'outcome',view:'round',round:4})).status,409);
 }finally{x.db.close();}
});

test('Policy-free API counts one vote and ignores stale policy fields',async()=>{
 const x=await setup(2);try{
  assert.equal((await x.vote(x.members[0])).status,200);
  assert.equal((await x.request('/api/answer',{member:x.members[1].member,module:'game0',value:'C',policy:'obsolete-option'})).status,200);
  assert.equal((await x.control({action:'resolve',round:0})).status,200);
  const s=await x.request('/api/state');assert.deepEqual(s.history[0].points,[3,3]);assert.equal(s.history[0].state.control,65);
  assert.deepEqual((await x.db.DB.prepare('SELECT DISTINCT policy FROM answers').all()).results.map(x=>x.policy),['']);
 }finally{x.db.close();}
});
test('Earlier saved game results cannot be silently mixed with new rules',async()=>{
 const x=await setup(2);try{
  const saved=[{rulesVersion:2,index:0,teams:[{team:'A',move:'C',breakdown:{C:1,R:0}},{team:'B',move:'C',breakdown:{C:1,R:0}}],state:{a:3,b:3,capability:32,control:53}}];
  await x.db.DB.prepare('UPDATE rooms SET history=?,round=1 WHERE code=?').bind(JSON.stringify(saved),x.room.code).run();
  assert.equal((await x.control({action:'resolve',round:1})).code,'GAME_RULES_CHANGED');
  assert.equal((await x.vote(x.members[0],1)).code,'GAME_RULES_CHANGED');
  assert.deepEqual((await x.request('/api/state')).history,saved);
  await x.control({action:'replay'});assert.deepEqual((await x.request('/api/state')).history,[]);
  assert.equal((await x.control({action:'round',round:0})).status,200);
 }finally{x.db.close();}
});
