import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gameNotes} from '../web/game-notes.js';
import {resolveRound,ROUNDS} from '../game.mjs';
const deck=JSON.parse(fs.readFileSync(new URL('../deck.json',import.meta.url),'utf8'));
const state=(history,extra={})=>({slide:9,round:history.length,history,revealed:false,outcome_view:'live',...extra});
test('Notes change between lobby, each live round, reveal and final debrief',()=>{
 assert.equal(gameNotes(deck,state([],{round:-1})).script,deck[9].script);
 for(let mask=0;mask<256;mask++){
  const history=[];
  for(let i=0;i<4;i++){
   const live=gameNotes(deck,state(history));
   assert.equal(live.script,deck[9].facilitation[i].say);assert.equal(live.phase,`round-${i}`);
   const votes=['A','B'].map((team,j)=>({team,value:mask&(1<<(i*2+j))?'R':'C'}));
   history.push(resolveRound(i,votes,history));
   const revealed=gameNotes(deck,state(history,{round:i,revealed:true,outcome_view:i===3?'summary':'round',outcome_round:i}));
   if(i===3){
    assert.ok(revealed.script.endsWith(deck[9].debrief.script));
    assert.ok(revealed.delivery.includes(`Control: ${history[3].state.control} / target 65.`));
    assert.ok(revealed.transition.includes('Speaker 4'));assert.equal(revealed.phase,'final');
   }else{assert.equal(revealed.phase,`result-${i}`);assert.ok(revealed.delivery.includes(String(history[i].points[0])));}
   const key=history[i].teams.map(t=>t.move).join('');
   assert.ok(revealed.script.includes(deck[9].result_meanings[key]));
  }
  const review=gameNotes(deck,state(history,{round:3,revealed:true,outcome_view:'round',outcome_round:0}));
  assert.equal(review.phase,'result-0');assert.ok(!review.transition.includes('Speaker 4'));
 }
});
test('Rules appear with the first round graph, not at QR joining; choices are individual',()=>{
 assert.ok(!deck[9].script.includes('Control starts at'));
 assert.ok(deck[9].facilitation[0].say.includes('Control starts at 50.'));
 assert.ok(deck[9].facilitation[0].say.includes('Government breaks a tie'));
 assert.ok(deck[9].facilitation[1].say.includes("Choose from your role's perspective."));
 assert.ok(!JSON.stringify(deck[9].facilitation).includes('Discuss your priorities'));
});
test('Speaker 3 has only matrix and game; solutions follow without a poll slide',()=>{
 assert.equal(deck.length,15);
 assert.deepEqual(deck.map((s,i)=>s.speaker===3?i:null).filter(i=>i!==null),[8,9]);
 assert.equal(deck[10].speaker,4);assert.equal(deck[10].title,'Make cooperation safer than racing.');
});
test('Simulation years start in 2025 and match the round notes',()=>{
 assert.deepEqual(ROUNDS.map(r=>r.year),['2025','2026','2027','Transition']);
 for(let i=0;i<3;i++)assert.equal(deck[9].facilitation[i].round,`Round ${i+1} / ${ROUNDS[i].year}`);
 assert.ok(deck[9].facilitation[0].say.startsWith('It is 2025.'));
 assert.equal(deck[9].transition,'Let us start with 2025.');
 assert.equal(deck[9].facilitation[0].next,'We now move to 2026.');
});
