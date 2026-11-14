export const TEAM_NAMES={A:'OpenBrain',B:'DeepCent'};
export function teamName(team){return TEAM_NAMES[team]||String(team);}
// All numbers are explicit teaching assumptions, not empirical risk estimates.
export const ROLES=[
 {id:'lab',name:'AI lab director',goal:'Keep your lab in the lead. Protect jobs, funding and useful discoveries.',question:'Would you slow down if your rival might take the lead?',cooperate:'Your lab gains time for safety checks, but growth can slow and a rival may take the lead.',race:'Your lab may gain a lead and earlier revenue. Less time for safety checks can put people and your lab at risk.'},
 {id:'government',name:'Government representative',goal:'Protect your side’s security, growth and ability to act independently.',question:'Would you allow outsiders to inspect sensitive AI projects?',cooperate:'Shared rules may reduce the threat from a rival, but limit your government’s freedom to act.',race:'You may protect a strategic lead. The rival may accelerate too, making both sides harder to govern.'},
 {id:'safety',name:'Independent safety scientist',goal:'Require strong safety evidence and a real way to stop unsafe AI.',question:'What would you need to know before accepting the next release?',cooperate:'You gain testing time and a chance to compare evidence. A rival may still hide unsafe work.',race:'Less time is available to test and correct problems. The team may advance before your concerns are resolved.'},
 {id:'public',name:'Public representative',goal:'Defend jobs, rights and safety, including people beyond both sides and future generations.',question:'Who should decide which risks everyone else must accept?',cooperate:'More oversight may protect people, but useful services and economic benefits can arrive later.',race:'People may receive useful AI sooner. They can also face risks they never agreed to take.'},
 {id:'undecided',name:'AI Council member',repeatable:true,goal:'Help your side grow and benefit from AI without losing safety and control.',question:'How much risk would you accept for earlier progress?',cooperate:'You gain time for checks and shared oversight. Growth may slow and a rival may move ahead.',race:'Your side may grow faster. Safety checks may fall behind, leaving others to bear the risk.'}
];

export const RULES_VERSION=5;
export const ROUNDS=[
 {year:'2025',title:'A warning before release',event:'Your AI helps with research. A test finds unexpected behaviour. More testing takes time; the rival may keep going.',question:'Keep safety checks, or push ahead?',source:'Fictional teaching scenario inspired by AI 2027.'},
 {year:'2026',title:'The rival is catching up',event:'Someone may be copying your AI. Oversight protects people but takes time. Racing may protect your lead while your rival catches up.',question:'Keep oversight, or race to protect your lead?',source:'Fictional competition dilemma; not an account of a specific incident.'},
 {year:'2027',title:'Research is speeding up',event:'AI helps build better AI. Research cycles shorten and people struggle to check the work. Extra review takes time your rival may use to move ahead.',question:'Keep people checking the AI, or develop faster?',source:'A hypothetical AI-research feedback loop inspired by AI 2027.'},
 {year:'Transition',title:'The final decision',event:'The next AI step may be hard to reverse. Oversight can delay useful applications. Racing could bring an advantage while exposing people to failures.',question:'Keep oversight, or race into the next step?',source:'Hypothetical transition, not a forecast or a test proving AI safety.'}
];
export const clamp=x=>Math.max(0,Math.min(100,x));
export const CONTROL_TARGET=65;
export const CONTROL_START=50;
export const CONTROL_EFFECTS={cooperate:15,race:-10};
export const PAYOFFS={standard:{CC:[3,3],CR:[0,5],RC:[5,0],RR:[1,1]},verified:{CC:[3,3],CR:[0,0],RC:[0,0],RR:[-1,-1]}};
export const isSimpleGame=history=>!history.length||[4,RULES_VERSION].includes(history[0].rulesVersion);
export const canContinueGame=history=>history.every(r=>r.rulesVersion===RULES_VERSION);
export const initialGameState=(history=[])=>({capability:20,control:history.length&&history[0].rulesVersion!==RULES_VERSION?45:CONTROL_START,a:0,b:0});
// Retained for interpreting saved results from earlier policy-based games.
export const usesCurrentRules=history=>!history.length||history[0].rulesVersion===2;
export const signedPoints=value=>value>0?'+'+value:String(value).replace('-','−');
export function checksAgreed(history){return !!history[1]?.teams.every(t=>t.move==='C');}
export function majority(values,fallback='R'){if(!values.length)return null;const counts={};for(const value of values)counts[value]=(counts[value]||0)+1;const max=Math.max(...Object.values(counts)),tied=Object.keys(counts).filter(x=>counts[x]===max);return tied.length===1?tied[0]:tied.includes(fallback)?fallback:[...tied].sort()[0];}
export function resolveRound(index,votes,history=[],options={}){
 if(index<0||index>=ROUNDS.length||index!==history.length)throw Error('Round out of sequence');
 if(!canContinueGame(history))throw Object.assign(Error('This game used earlier rules. Choose Replay game to start with 50 control and +15 for both cooperating.'),{status:409,code:'GAME_RULES_CHANGED'});
 if(votes.some(v=>!['A','B'].includes(v.team)||!['C','R'].includes(v.value)))throw Object.assign(Error('Choose Cooperate or Race.'),{status:400});
 const missing=['A','B'].filter(team=>!votes.some(v=>v.team===team)&&!options.fallbacks?.[team]);
 if(missing.length)throw Object.assign(Error('Both sides need a decision. Choose for '+missing.map(teamName).join(' and ')+', or wait for a vote.'),{status:409,code:'MISSING_BLOC_DECISIONS',missing});
 const teams=['A','B'].map(team=>{
  const ballots=votes.filter(v=>v.team===team);
  if(!ballots.length){const move=options.fallbacks[team].move;if(!['C','R'].includes(move))throw Object.assign(Error('Choose Cooperate or Race for '+teamName(team)),{status:400,code:'INVALID_MODERATOR_DECISION'});return {team,move,votes:0,source:'moderator',breakdown:{C:0,R:0},tieBreak:{}};}
  const breakdown={C:ballots.filter(v=>v.value==='C').length,R:ballots.filter(v=>v.value==='R').length},government=ballots.find(v=>(v.role_id||v.role)==='government'),tie=breakdown.C===breakdown.R;
  const move=tie?(government?.value||'R'):breakdown.C>breakdown.R?'C':'R';
  return {team,move,votes:ballots.length,source:'participants',breakdown,tieBreak:tie?{move:government?'government':'default'}:{}};
 });
 const previous=history.at(-1)?.state||initialGameState(),key=teams.map(t=>t.move).join(''),races=teams.filter(t=>t.move==='R').length;
 const points=[...PAYOFFS.standard[key]],controlChanges=[races?{label:races===2?'Both race':'One side races',points:CONTROL_EFFECTS.race*races}:{label:'Both cooperate',points:CONTROL_EFFECTS.cooperate}];
 const raw=previous.control+controlChanges.reduce((n,c)=>n+c.points,0),delta=index===3?40:races?20+index*6:12+index*4;
 const result={rulesVersion:RULES_VERSION,index,teams,points,verified:false,agreement:'none',state:{capability:clamp(previous.capability+delta),control:clamp(raw),a:previous.a+points[0],b:previous.b+points[1]},controlChanges,controlLimit:clamp(raw)-raw,moderatedBlocs:teams.filter(t=>t.source==='moderator').map(t=>t.team)};
 result.consequence=roundExplanation(result).summary;
 if(result.moderatedBlocs.length)result.consequence+=' Moderator choice for '+result.moderatedBlocs.map(teamName).join(', ')+'. No participant votes were added.';
 if(index===3)result.ending=ending([...history,result]);
 return result;
}
export function controlBreakdown(result){
 const changes=(result.controlChanges||[]).map(change=>({...change,label:change.label.replace('One council races','One side races')}));
 if(!result.controlLimit)return changes;
 return [...changes,{label:result.state.control===0?'Floor at 0':'Cap at 100',points:result.controlLimit}];
}
export function ending(history) {
 if(isSimpleGame(history)){
  const met=history.at(-1).state.control>=CONTROL_TARGET;
  return met?{kind:'ordered',title:'Control target met',text:'AI advances while oversight keeps the control score at or above the game target. This does not prove real-world safety.'}:{kind:'race',title:'Control below target',text:'AI advances while human control stays below the game target. Workers and users face weaker safeguards.'};
 }
 if(history[0]?.rulesVersion===3){
  const met=history.at(-1).state.control>=CONTROL_TARGET,checks=checksAgreed(history);
  if(met&&!checks)return {kind:'fragile',title:'Control target met, but no shared checks',text:'The control score reaches the target, but the sides did not agree to inspections and penalties. Promises remain unchecked.'};
  return met?{kind:'ordered',title:'Control target met',text:'AI advances with shared checks and enough control in our game. Tests can still miss failures.'}:{kind:'race',title:'Control below target',text:'AI advances while human control stays below the target. The safeguards have not repaired all the control lost through racing.'};
 }
 const last=history.at(-1),s=last.state;
 if(last.agreement==='moratorium')return {kind:'delay',title:'The final step is paused',text:'Both sides postpone the final AI advance. A pause gives more time. Missing safeguards still need work, and useful benefits arrive later.'};
 const gates=last.agreement==='gates',controlMet=s.control>=CONTROL_TARGET,threshold=s.capability>=100;
 const current=usesCurrentRules(history);
 const legacySafeguards=history[1]?.agreement==='audit'&&history[2]?.agreement==='secure'&&s.legitimacy>=65;
 if(threshold&&gates&&controlMet&&(current||legacySafeguards))return {kind:'ordered',title:'A governed transition',text:'AI advances with independent stop rights and enough human control in the game.'};
 if(threshold&&(current?!gates&&!controlMet:s.control<50))return {kind:'race',title:'AI advances faster than human control',text:'AI moves ahead while human control falls short. Workers and users face weaker safeguards.'};
 return {kind:'fragile',title:'A fragile transition',text:'AI advances with some safeguards. The result shows which requirement is missing.'};
}
export const POLICY_LABELS={pledge:'A promise only',audit:'Checks + penalties',secret:'Keep research secret',open:'Publish everything',secure:'Share with public oversight',deploy:'Release now',gate:'Independent safety checks',moratorium:'Pause the final step'};
export function roundExplanation(result){
 const key=result.teams.map(t=>t.move).join('');
 const cases={CC:{headline:'Both sides cooperate.',summary:'Both keep oversight. Each gets three points.',ethics:'People gain more oversight, but useful applications may arrive later.',risk:'Cooperation depends on the other side keeping the deal.'},CR:{headline:'OpenBrain cooperates. DeepCent races.',summary:'DeepCent gains the lead. OpenBrain accepts limits that DeepCent does not.',ethics:'DeepCent gets ahead. People on both sides and beyond face the risks.',risk:'OpenBrain pays the cost of slowing down while DeepCent moves ahead.'},RC:{headline:'OpenBrain races. DeepCent cooperates.',summary:'OpenBrain gains the lead. DeepCent accepts limits that OpenBrain does not.',ethics:'OpenBrain gets ahead. People on both sides and beyond face the risks.',risk:'DeepCent pays the cost of slowing down while OpenBrain moves ahead.'},RR:{headline:'Both sides race.',summary:'Both push ahead. Each gets one point while human control weakens.',ethics:'The public faces more risk without choosing to enter the race.',risk:'Each side fears that cooperation will let the other get ahead.'}};
 const explanation={...cases[key],key};
 if(isSimpleGame([result])&&(key==='CR'||key==='RC')){const racer=key==='CR'?'DeepCent':'OpenBrain',cooperator=key==='CR'?'OpenBrain':'DeepCent';explanation.summary=`${racer} gets five points. ${cooperator} gets zero.`;explanation.ethics=`${racer} gains more points this round. People on both sides and beyond face the risks.`;}
 if(result.verified&&key!=='CC'){explanation.summary=key==='RR'?'Both break the agreement. Each loses one point.':'One side breaks the agreement. Penalties remove its racing gain.';}
 if(result.rulesVersion===3&&result.verified){explanation.ethics='Both labs face inspections, costs and less secrecy. People still depend on those checks working.';explanation.risk='Our game assumes cheating is detected and penalties work.';}
 if(result.agreement==='audit'){explanation.ethics='Both accept independent checks. Inspectors gain access to sensitive work.';explanation.risk='Checks can expose secrets. Their success still depends on detecting cheating.';}
 if(result.agreement==='secure'){explanation.ethics='Affected communities gain a voice. An energy budget limits the burden of scaling.';explanation.risk='Shared research can spread useful and dangerous knowledge.';}
 if(result.agreement==='gates'){explanation.ethics='Independent people can stop a release. Benefits may arrive later.';explanation.risk='Safety tests can miss failures; a formal approval is no guarantee.';}
 if(result.agreement==='moratorium'){explanation.ethics='A pause buys time. It does not repair missing safeguards; useful benefits arrive later.';explanation.risk='A pause only lasts if both sides keep it.';}
 return explanation;
}
export function endingExplanation(history){
 if(history.length<4)return null;
 if(isSimpleGame(history)){
  const s=history.at(-1).state,met=s.control>=CONTROL_TARGET,outcome=ending(history);
  return {kind:outcome.kind,title:outcome.title,headline:met?'AI advances. Control reaches the target.':'AI advances faster than human control.',summary:outcome.text,
   reason:`Control ${s.control} / target ${CONTROL_TARGET}.`,checks:[{label:'Control target',met}],
   control:{value:s.control,target:CONTROL_TARGET,met},capability:{value:s.capability,target:100,met:s.capability>=100},
   riskWho:met?'Workers and users: oversight can still miss failures.':'Workers, users and people beyond both sides.',
   costWho:met?'Cooperating labs accept checks, costs and delays.':'Cooperating labs pay for checks; the public faces weaker safeguards.'};
 }
 if(history[0]?.rulesVersion===3){
  const s=history.at(-1).state,met=s.control>=CONTROL_TARGET,agreed=checksAgreed(history),outcome=ending(history);
  return {kind:outcome.kind,title:outcome.title,headline:met&&agreed?'AI advances. Control reaches the target.':met?'Control target met. Shared checks are missing.':'AI advances faster than human control.',summary:outcome.text,
   reason:!agreed?'No agreement in round 2. Control '+s.control+' / '+CONTROL_TARGET+'.':'Shared checks active. Control '+s.control+' / '+CONTROL_TARGET+'.',
   checks:[{label:'Shared inspections',met:agreed},{label:'Shared penalties',met:agreed},{label:'Control target',met}],
   control:{value:s.control,target:CONTROL_TARGET,met},capability:{value:s.capability,target:100,met:s.capability>=100},
   riskWho:met&&agreed?'Workers and users: checks can still miss failures.':'Workers, users and people beyond both sides.',
   costWho:agreed?'Both labs pay for inspections; safety limits delay some benefits.':'Cooperating sides accept delays; people rely on unchecked promises.'};
 }
 const last=history.at(-1),outcome=ending(history),s=last.state,current=usesCurrentRules(history);
 const checks=[{label:'Shared inspections',met:history[1]?.agreement==='audit'},{label:'Public oversight',met:history[2]?.agreement==='secure'},{label:'Independent stop rights',met:last.agreement==='gates'}];
 const control={value:s.control,target:CONTROL_TARGET,met:s.control>=CONTROL_TARGET};
 const capability={value:s.capability,target:100,met:s.capability>=100};
 const gates=checks[2].met;
 const headlines={ordered:'AI advances. People retain control.',delay:control.met?'You paused the final step.':'You paused. Control is still weak.',race:'AI advances faster than human control.',fragile:'Some safeguards are still missing.'};
 let reason;
 if(outcome.kind==='delay')reason='Both agreed to pause the final step.';
 else if(!current&&!checks[0].met)reason='No binding inspections in round 2.';
 else if(!current&&!checks[1].met)reason='No public oversight in round 3.';
 else if(!gates&&!control.met)reason='Low control and no independent stop rights.';
 else if(!gates)reason='No independent stop rights.';
 else if(!control.met)reason='Control stayed below '+CONTROL_TARGET+'.';
 else reason='Control target and stop rights both in place.';
 const impacts={
  ordered:{riskWho:'Workers and users: safety tests can still miss failures.',costWho:'Both labs accept checks and possible delays.'},
  delay:{riskWho:control.met?'Workers and users rely on both sides waiting.':'Workers and users still face weak safeguards.',costWho:'Patients and workers wait longer for useful AI.'},
  race:{riskWho:'Workers, users and people beyond both sides.',costWho:'Both labs fund the race; the public faces failures.'},
  fragile:{riskWho:'Workers and users remain exposed to gaps in oversight.',costWho:'People face failures; new checks may delay benefits.'}
 };
 return {headline:headlines[outcome.kind],summary:outcome.text,...impacts[outcome.kind],kind:outcome.kind,title:outcome.title,reason,checks,control,capability};
}
export function roundConsequences(result){
 const key=result.teams.map(t=>t.move).join('');
 const cases={CC:{riskWho:'Workers and users depend on both sides keeping the deal.',costWho:'Both sides accept delays; useful AI arrives later.'},CR:{riskWho:'Workers and users on both sides, and beyond.',costWho:'OpenBrain slows down; DeepCent takes the lead.'},RC:{riskWho:'Workers and users on both sides, and beyond.',costWho:'DeepCent slows down; OpenBrain takes the lead.'},RR:{riskWho:'Workers, users and people beyond both sides.',costWho:'Both sides fund the race; the public faces failures.'}};
 let impact=cases[key];
 if(isSimpleGame([result])){if(key==='CC')impact.costWho='Both labs pay for oversight and accept slower progress.';if(key==='CR')impact.costWho='OpenBrain pays for checks; DeepCent gains five points.';if(key==='RC')impact.costWho='DeepCent pays for checks; OpenBrain gains five points.';return impact;}
 if(result.rulesVersion===3){
  if(result.verified)impact={...impact,costWho:key==='CC'?'Both labs pay for checks, share sensitive work and accept delays.':key==='RR'?'Both labs lose points and pay for inspections.':(key==='CR'?'DeepCent':'OpenBrain')+' loses its racing gain; both labs pay for checks.'};
  return impact;
 }
 if(result.controlChanges?.some(x=>x.label==='Research secrecy'))impact={...impact,riskWho:'Workers and users have less outside scrutiny.'};
 if(result.controlChanges?.some(x=>x.label==='Open publication'))impact={...impact,riskWho:'Dangerous techniques can spread beyond both sides.'};
 if(result.agreement==='audit')impact={riskWho:'The public still depends on inspectors finding cheating.',costWho:'Both labs pay for checks and expose sensitive work.'};
 if(result.agreement==='secure')impact={riskWho:'Workers and users depend on shared oversight working.',costWho:'Both labs share power and accept an energy budget.'};
 if(result.agreement==='gates')impact={riskWho:'Workers and users: safety tests can still miss failures.',costWho:'Both labs accept delays and independent stop rights.'};
 if(result.agreement==='moratorium')impact={riskWho:result.state.control<65?'Workers and users still face weak safeguards.':'People depend on both sides maintaining the pause.',costWho:'Patients and workers wait longer for useful AI.'};
 if(result.verified&&key!=='CC')impact={...impact,costWho:key==='RR'?'Both labs lose points; the public still faces failures.':(key==='CR'?'DeepCent':'OpenBrain')+' loses its racing gain through penalties.'};
 return impact;
}
export function activeModule(room){return room.slide===9&&room.round>=0?'game'+room.round:null;}
export const POLLS={forecast:{question:'When will AI exceed the best humans across almost all cognitive domains?',options:['By 2027','By 2030','2031–2040','After 2040','Never']},emotion:{question:'What is your first emotional reaction?',options:['Excitement','Hope','Curiosity','Skepticism','Anxiety','Loss of control']},final:{question:'Can AI advance while people keep control?',options:['Realistic','Possible, but fragile','Unrealistic']}};
