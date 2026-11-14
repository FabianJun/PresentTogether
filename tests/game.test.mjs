import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRound,endingExplanation,roundExplanation,CONTROL_TARGET,controlBreakdown,PAYOFFS,RULES_VERSION,initialGameState} from '../game.mjs';
const votes=(a='C',b=a)=>[{team:'A',value:a},{team:'B',value:b}];
const play=moves=>moves.reduce((h,[a,b])=>[...h,resolveRound(h.length,votes(a,b),h)],[]);

test('Original points favour Race individually but mutual cooperation beats mutual racing',()=>{
 assert.deepEqual(resolveRound(0,votes('R','C')).points,[5,0]);
 assert.ok(PAYOFFS.standard.RC[0]>PAYOFFS.standard.CC[0]);
 assert.ok(PAYOFFS.standard.RR[0]>PAYOFFS.standard.CR[0]);
 assert.ok(PAYOFFS.standard.CC[0]>PAYOFFS.standard.RR[0]);
});
test('Every round uses the same original matrix, irrespective of earlier choices',()=>{
 for(const earlier of [['C','C'],['R','R'],['C','R'],['R','C']]){
  const h=[];
  for(let i=0;i<4;i++){
   for(const a of ['C','R'])for(const b of ['C','R']){
    const r=resolveRound(i,votes(a,b),h);assert.deepEqual(r.points,PAYOFFS.standard[a+b]);assert.equal(r.verified,false);
    assert.equal(r.controlChanges.length,1);assert.equal('policy' in r.teams[0],false);
   }
   h.push(resolveRound(i,votes(...earlier),h));
  }
 }
});
test('Cooperation keeps oversight from round 1, without a separate agreement or bonus',()=>{
 const h=play(Array(4).fill(['C','C']));
 assert.deepEqual(h.map(r=>r.state.control),[65,80,95,100]);
 assert.deepEqual(h.map(r=>r.controlChanges),Array(4).fill([{label:'Both cooperate',points:15}]));
 assert.ok(h.every(r=>r.agreement==='none'&&!r.verified));
});
test('All cooperation meets the goal; all racing loses control',()=>{
 const good=play(Array(4).fill(['C','C'])),bad=play(Array(4).fill(['R','R']));
 assert.equal(good[3].ending.kind,'ordered');assert.deepEqual(good[3].state,{capability:100,control:100,a:12,b:12});
 assert.equal(bad[3].ending.kind,'race');assert.equal(bad[3].state.control,0);assert.equal(bad[3].verified,false);
 assert.equal('legitimacy' in good[3].state,false);
});
test('Two players yield clear decisions with no policy resolution',()=>{
 const h=[];
 for(let i=0;i<4;i++){
  for(const a of ['C','R'])for(const b of ['C','R']){
   const r=resolveRound(i,votes(a,b),h);assert.deepEqual(r.teams.map(t=>t.move),[a,b]);
   for(const t of r.teams){assert.equal(t.votes,1);assert.deepEqual(t.tieBreak,{});assert.equal('policy' in t,false);assert.equal('policyBreakdown' in t,false);}
  }
  h.push(resolveRound(i,votes(),h));
 }
});
test('Missing side needs a labelled moderator decision without invented votes',()=>{
 assert.throws(()=>resolveRound(0,[votes()[0]]),{code:'MISSING_BLOC_DECISIONS',status:409,missing:['B']});
 assert.throws(()=>resolveRound(0,[votes()[0]],[],{fallbacks:{B:{move:'x'}}}),{code:'INVALID_MODERATOR_DECISION'});
 const r=resolveRound(0,[votes()[0]],[],{fallbacks:{B:{move:'R'}}});
 assert.equal(r.teams[1].source,'moderator');assert.equal(r.teams[1].votes,0);assert.deepEqual(r.teams[1].breakdown,{C:0,R:0});
});
test('All 256 strategy paths have consistent unchanged points, control and endings',()=>{
 const counts={};
 for(let mask=0;mask<256;mask++){
  const h=[];let control=50,a=0,b=0;
  for(let i=0;i<4;i++){
   const moves=[0,1].map(j=>mask&(1<<(i*2+j))?'R':'C'),r=resolveRound(i,votes(...moves),h);
   const points=PAYOFFS.standard[moves.join('')];
   a+=points[0];b+=points[1];
   const races=moves.filter(m=>m==='R').length,raw=control+(races?-10*races:15);
   control=Math.max(0,Math.min(100,raw));
   assert.deepEqual(r.points,points);assert.equal(r.verified,false);assert.equal(r.state.control,control);
   assert.equal(r.state.a,a);assert.equal(r.state.b,b);assert.equal(r.rulesVersion,RULES_VERSION);
   assert.equal(controlBreakdown(r).reduce((n,c)=>n+c.points,0),control-(h.at(-1)?.state.control??50));h.push(r);
  }
  const e=endingExplanation(h),met=control>=CONTROL_TARGET;
  assert.equal(e.kind,met?'ordered':'race');assert.equal(h[3].state.capability,100);assert.equal(e.control.met,met);
  assert.equal(e.checks[0].met,met);counts[e.kind]=(counts[e.kind]||0)+1;
 }
 assert.ok(counts.ordered>0&&counts.race>0);
});
test('Earlier games require replay rather than silently changing their rules',()=>{
 for(const rulesVersion of [2,3,4]){const old={...resolveRound(0,votes()),rulesVersion};
 assert.throws(()=>resolveRound(1,votes(),[old]),{code:'GAME_RULES_CHANGED',status:409});}
});

test('Saved v3 results retain their original agreement interpretation',()=>{
 const h=play(Array(4).fill(['C','C'])).map(r=>({...r,rulesVersion:3,verified:r.index>=2}));
 h[3].state={...h[3].state,control:100};
 const old=endingExplanation(h);assert.equal(old.kind,'ordered');assert.equal(old.checks[0].met,true);
 h[1].teams[0]={...h[1].teams[0],move:'R'};
 const noDeal=endingExplanation(h);assert.equal(noDeal.kind,'fragile');assert.equal(noDeal.checks[0].met,false);
});

test('One mutual-race round can be repaired in any position; two cannot',()=>{
 for(let race=0;race<4;race++){
  const h=play(Array.from({length:4},(_,i)=>i===race?['R','R']:['C','C']));
  assert.deepEqual(h.at(-1).state,{capability:100,control:75,a:10,b:10});
  assert.equal(h.at(-1).ending.kind,'ordered');
 }
 const h=play([['R','R'],['R','R'],['C','C'],['C','C']]);
 assert.equal(h.at(-1).state.control,40);assert.equal(h.at(-1).ending.kind,'race');
 const lone=play([['R','C'],['C','C'],['C','C'],['C','C']]);
 assert.deepEqual(lone.at(-1).state,{capability:100,control:85,a:14,b:9});
});
test('Saved v4 results keep their old control trajectory and target-only ending',()=>{
 const h=play(Array(4).fill(['C','C'])).map((r,i)=>({...r,rulesVersion:4,state:{...r.state,control:55+10*i},controlChanges:[{label:'Both cooperate',points:10}],controlLimit:0}));
 assert.equal(initialGameState(h).control,45);assert.equal(initialGameState().control,50);
 assert.equal(endingExplanation(h).kind,'ordered');assert.equal(endingExplanation(h).control.value,85);
 assert.equal(endingExplanation(h).checks.length,1);
});
