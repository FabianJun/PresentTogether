import {CONTROL_TARGET,initialGameState,teamName} from '../game.mjs';

function resultNotes(slide,history,result){
 const before=history[result.index-1]?.state.control??initialGameState(history).control,delta=result.state.control-before;
 const points=result.points[0]===result.points[1]?`Each side gained ${result.points[0]} points.`:`OpenBrain gained ${result.points[0]} points; DeepCent gained ${result.points[1]}.`;
 const control=delta===0?'Control stayed unchanged.':`Control ${delta>0?'rose':'fell'} by ${Math.abs(delta)}.`;
 const meaning=slide.result_meanings[result.teams.map(t=>t.move).join('')];
 return {script:meaning,numbers:`${points} ${control}`};
}

// One source for the moderator, private speaker view and offline notes.
export function gameNotes(deck,state){
 const slide=deck[9];
 const base={phase:'lobby',label:'Game introduction',script:slide.script,delivery:slide.delivery,transition:slide.transition};
 if(state?.slide!==9||state.round<0)return base;
 const history=state.history||[],view=state.outcome_view||'auto';
 const reviewing=view==='round'&&history[state.outcome_round];
 const result=reviewing||((view==='summary'||state.revealed)?history.at(-1):null);
 if(result?.index===3&&history.length===4){
  const s=result.state,lead=s.a===s.b?`Both sides finished with ${s.a} points.`:`${teamName(s.a>s.b?'A':'B')} finished ahead: ${Math.max(s.a,s.b)} points against ${Math.min(s.a,s.b)}.`;
  const notes=resultNotes(slide,history,result);
  return {phase:'final',label:'Final result / handover to Speaker 4',script:`${notes.script}\n\n${slide.debrief.script}`,
   delivery:`${notes.numbers} ${lead} Control: ${s.control} / target ${CONTROL_TARGET}. ${s.control>=CONTROL_TARGET?'The game target was met.':'Control stayed below the game target.'} ${slide.debrief.delivery}`,
   transition:slide.debrief.transition};
 }
 if(result){
  const cue=slide.facilitation[result.index],notes=resultNotes(slide,history,result);
  return {phase:`result-${result.index}`,label:`Round ${result.index+1} / result`,script:notes.script,
   delivery:`${notes.numbers} ${cue.result_action}`,transition:cue.next};
 }
 const cue=slide.facilitation[state.round];
 return cue?{phase:`round-${state.round}`,label:cue.round,script:cue.say,delivery:cue.action,transition:''}:base;
}
