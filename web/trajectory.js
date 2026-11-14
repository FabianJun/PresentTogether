import {initialGameState,ROUNDS} from '/game.mjs';
const ink='#64728B',blue='#275DFF',teal='#078592',grid='#D8E0EF',bg='#F5F7FC';
const text=(x,y,s,size=28,color=ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="500" ${extra}>${s}</text>`;
const path=(d,color,width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export function trajectory(history,{x=660,y=410,w=820,h=320,compact=false}={}){
 const values=[initialGameState(history),...history.map(r=>r.state)],latest=values.at(-1),px=i=>x+i*w/4,py=v=>y+h-v*h/100;
 let s='<g class="game-trajectory" role="img" aria-label="AI capability and human control across decision rounds. Model scores, not measured safety. Dashed line: control target 65.">';
 s+=text(x,compact?y-88:y-45,`AI capability: ${latest.capability}`,30,blue)+text(compact?x:x+w/2,compact?y-48:y-45,`Human control: ${latest.control}${compact?' / target 65':''}`,30,teal);
 s+=text(x-78,y+h/2,'Model score (0–100)',28,ink,`text-anchor="middle" transform="rotate(-90 ${x-78} ${y+h/2})"`);
 for(const v of (compact?[0,25,50,100]:[0,25,50,75,100]))s+=path(`M${x} ${py(v)}H${x+w}`,grid,1)+text(x-18,py(v)+9,v,28,ink,'text-anchor="end"');
 s+=path(`M${x} ${y}V${y+h}H${x+w}`,ink)+path(`M${x} ${py(65)}H${x+w}`,teal,2.5,'stroke-dasharray="10 9" data-control-target="65"');
 if(history[2]?.rulesVersion===3&&history[2].verified){const start=px(2.5);s+=path(`M${start} ${y}V${y+h}`,teal,1.5,'stroke-dasharray="4 6" data-checks-start="3"')+text(start+12,y+25,'Checks start',24,teal);}
 for(const [key,color] of [['capability',blue],['control',teal]]){
  const points=values.map((v,i)=>[px(i),py(v[key])]);s+=path('M'+points.map(p=>p.join(' ')).join('L'),color,5);
  for(const [xx,yy] of points)s+=`<circle cx="${xx}" cy="${yy}" r="7" fill="${color}"/>`;
 }
 // The initial segment is always below 65; keep this label away from later data.
 if(!compact)s+=`<rect x="${x+10}" y="${py(65)-38}" width="275" height="33" fill="${bg}"/>`+text(x+20,py(65)-13,'Control target: 65',28,teal);
 if(compact)s+=text(x-18,py(65)+9,'65',28,teal,'text-anchor="end"');
 ['Start',...ROUNDS.map(r=>compact&&r.year==='Transition'?'Final':r.year)].forEach((label,i)=>s+=path(`M${px(i)} ${y+h}v8`,ink)+text(px(i),y+h+38,label,28,ink,`text-anchor="${i===4?'end':i===0?'start':'middle'}"`));
 return s+text(x+w/2,y+h+71,'Decision round',28,ink,'text-anchor="middle"')+'</g>';
}
