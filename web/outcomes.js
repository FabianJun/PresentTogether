import {roundExplanation,endingExplanation,roundConsequences,teamName,controlBreakdown,signedPoints,PAYOFFS,isSimpleGame,initialGameState,ROUNDS} from '/game.mjs';
import {trajectory} from '/trajectory.js';
const c={ink:'#111E38',blue:'#275DFF',muted:'#64728B',white:'#FFFFFF',line:'#D8E0EF',red:'#D95136',teal:'#078592'};
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const wrap=(s,max)=>{let a=[''];for(const w of s.split(/\s+/)){let i=a.length-1;if((a[i]+' '+w).trim().length>max&&a[i])a.push(w);else a[i]+=(a[i]?' ':'')+w;}return a.join('\n');};
const t=(x,y,s,size=28,color=c.ink,weight=450,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" ${extra}>${String(s).split('\n').map((v,i)=>`<tspan x="${x}" dy="${i?size*1.15:0}">${esc(v)}</tspan>`).join('')}</text>`;
const rect=(x,y,w,h,fill=c.white,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}"/>`;
const line=(x,y,w)=>`<path d="M${x} ${y}h${w}" stroke="${c.line}"/>`;
const policies={pledge:'Promise only',audit:'Checks + penalties',secret:'Keep research secret',open:'Publish everything',secure:'Shared public oversight',deploy:'Deploy now',gate:'Independent stop rights',moratorium:'Pause the final step'};
function scoreCards(result,history,final=false){
 let s=t(76,205,final?'Total competitive points':`Round ${result.index+1}: competitive points`,28,c.muted);
 result.teams.forEach((team,i)=>{const x=76+i*354,total=result.state[i?'b':'a'];
  s+=`<g data-score-team="${team.team}">`+rect(x,224,330,final?123:140)+t(x+20,254,teamName(team.team),30,i?c.red:c.blue,650);
  if(final)s+=t(x+306,310,total,52,c.ink,650,'text-anchor="end" data-total-points="'+total+'"')+t(x+20,310,'Total points',26,c.ink,550);
  else s+=t(x+20,282,team.move==='C'?'Cooperate':'Race',24,c.ink,550)+t(x+310,282,team.source==='moderator'?'0 votes · host':`${team.votes} vote${team.votes===1?'':'s'}`,20,c.muted,450,'text-anchor="end"')+t(x+20,313,'This round',23,c.muted)+t(x+306,313,signedPoints(result.points[i]),32,c.ink,600,'text-anchor="end" data-round-points="'+result.points[i]+'"')+t(x+20,351,'Total',26,c.ink,600)+t(x+306,351,total,38,c.ink,650,'text-anchor="end" data-total-points="'+total+'"');
  s+='</g>';
 });return s;
}
function consequences(impact){
 return line(76,711,1452)+t(76,742,'Who carries the risk?',28,c.red,650)+t(76,779,wrap(impact.riskWho,49),28,c.ink,500)+t(822,742,'Who pays the cost?',28,c.blue,650)+t(822,779,wrap(impact.costWho,49),28,c.ink,500);
}
function payoff(result){
 const key=result.teams.map(x=>x.move).join(''),matrix=result.verified?PAYOFFS.verified:PAYOFFS.standard;
 let s=t(515,392,'DeepCent',28,c.red,650,'text-anchor="middle"')+t(395,422,'Cooperate',28,c.muted,450,'text-anchor="middle"')+t(635,422,'Race',28,c.muted,450,'text-anchor="middle"')+t(76,433,'OpenBrain',28,c.blue,650)+t(76,486,'Cooperate',28)+t(76,582,'Race',28);
 ['CC','CR','RC','RR'].forEach((cell,i)=>{const x=285+i%2*240,y=440+Math.floor(i/2)*96,selected=cell===key,v=matrix[cell];s+=rect(x,y,220,78,selected?c.blue:c.white,selected?'none':c.line)+t(x+110,y+52,`${v[0]} / ${v[1]}`,42,selected?c.white:c.muted,650,'text-anchor="middle"');});return s;
}
export function roundOutcomeArt(state){
 const history=state.history||[],r=history[state.outcome_round??state.round]||history.at(-1);if(!r)return '';
 const e=roundExplanation(r),shown=history.slice(0,r.index+1);
 let s=t(72,150,e.headline,54,c.ink,620,'letter-spacing="-2"')+scoreCards(r,shown)+payoff(r)+trajectory(shown,{x:900,y:287,w:600,h:224,compact:true});
 if(r.verified)s+=t(76,391,'Checks active',24,c.teal,650);
 if(isSimpleGame([r])){
  s+=t(76,653,'Cooperate = safety checks + oversight',28,c.blue,600);
  s+=t(76,689,'Race = faster progress, weaker safeguards',28,c.red,550);
 }else if(r.rulesVersion===3){
  s+=t(76,653,r.verified?'Shared checks + penalties':'Original points / no shared agreement',28,c.muted,550);
 }else r.teams.forEach((team,i)=>{s+=t(76,651+i*38,`${teamName(team.team)}: ${policies[team.policy]||team.policy}`,28,c.ink,500);});
 const before=shown.length>1?shown.at(-2).state:initialGameState(shown),delta=r.state.control-before.control;
 s+=t(900,620,`Control ${before.control} → ${r.state.control} (${signedPoints(delta)})`,30,delta<0?c.red:c.teal,650);
 controlBreakdown(r).forEach(({label,points},i)=>{s+=t(900+(i%2)*315,655+Math.floor(i/2)*34,`${signedPoints(points)} ${label}`,24,points<0?c.red:c.teal,550);});
 s+=consequences(roundConsequences(r));
 return s;
}
export function finalOutcomeArt(state){
 const history=state.history||[],e=endingExplanation(history);if(!e)return '';
 const last=history.at(-1),a=last.state.a,b=last.state.b;
 let s=t(72,150,e.headline,54,c.ink,620,'letter-spacing="-2"')+scoreCards(last,history,true)+trajectory(history,{x:900,y:296,w:600,h:250,compact:true});
 [[76,'Round'],[255,'OpenBrain'],[515,'DeepCent']].forEach(([x,label])=>s+=t(x,395,label,28,c.muted,550));
 history.forEach((r,i)=>{const y=448+i*51;s+=line(76,y-32,690)+t(76,y,ROUNDS[i].year==='Transition'?'Final':ROUNDS[i].year,28,c.ink,500);r.teams.forEach((team,j)=>s+=t(j?515:255,y,`${team.move==='C'?'Cooperate':'Race'} ${signedPoints(r.points[j])}`,28,team.move==='C'?c.blue:c.red,550));});
 s+=t(76,650,a===b?'Both finish with equal points':`${a>b?'OpenBrain':'DeepCent'} leads by ${Math.abs(a-b)} points`,30,c.ink,600);
 s+=t(76,689,e.reason,28,c.muted);
 s+=t(900,661,e.control.met?'Control target met':'Control below target',28,e.control.met?c.teal:c.red,600);
 if(isSimpleGame(history))s+=t(900,695,'Oversight can still miss failures',28,c.muted,550);else if(last.rulesVersion===3)s+=t(900,695,last.verified?'Shared checks active':'Shared checks missing',28,last.verified?c.teal:c.red,550);else if(e.kind!=='delay')s+=t(900,695,e.checks[2].met?'Independent stop rights active':'Independent stop rights missing',28,e.checks[2].met?c.teal:c.red,600);
 s+=consequences(e);
 if(state.example)s+=t(76,95,'WORKED EXAMPLE',24,c.blue,600);
 return s;
}
