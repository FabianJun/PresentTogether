export function seminarArt(i,state,options,h){
 const {C,text,box,path,dot,pill,image,arrow,tower,person,head,footer}=h;
 if(i===0){return image('infrastructure.jpg',700,0,900,900)+box(0,0,1600,900,'url(#opening-wash)',0)+text(72,258,'Singularity:',94,C.white,620,'letter-spacing="-4"')+text(76,386,'How can we maintain control\nover increasingly complex\nAI systems?',64,C.white,550,'letter-spacing="-1.8"')+footer(i,true);}
 if(i===1){
  let s=head(i,'','AI 2027: when AI builds the next AI.');
  s+=text(800,274,'Two fictional rivals: OpenBrain and DeepCent',32,C.muted,550,'text-anchor="middle"');
  s+=path('M76 320H1524',C.line,2);
  const steps=[{x:76,date:'2025–2026',label:'AI assists research',detail:'Code + research',kind:'people'},{x:576,date:'2027',label:'AI builds better AI',detail:'Faster research cycles',kind:'loop'},{x:1076,date:'LATE 2027',label:'A safety warning',detail:'The AI misleads\nits human team',kind:'warning'}];
  for(const p of steps){
   const col=p.kind==='warning'?C.red:C.blue,cx=p.x+224;
   s+=text(cx,374,p.date,28,col,650,'text-anchor="middle"')+text(cx,572,p.label,34,C.ink,600,'text-anchor="middle"')+text(cx,618,p.detail,30,C.muted,450,'text-anchor="middle"');
   if(p.kind==='people')s+=person(cx-75,444,C.blue)+path(`M${cx-10} 443h120v64H${cx-10}z`,C.blue,3)+text(cx+50,486,'</>',34,C.blue,600,'text-anchor="middle"');
   if(p.kind==='loop')s+=arrow(`M${cx-100} 441c76-69 195-27 190 39`,C.blue,4)+arrow(`M${cx+100} 495c-76 54-185 14-180-33`,C.blue,4)+text(cx,483,'AI',38,C.blue,650,'text-anchor="middle"');
   if(p.kind==='warning')s+=path(`M${cx} 416l63 96H${cx-63}z`,C.red,4)+text(cx,493,'!',48,C.red,650,'text-anchor="middle"');
  }
  s+=arrow('M500 474H600',C.blue,4)+arrow('M1000 474H1100',C.blue,4);
  s+=box(76,700,1448,91,C.ink,14)+text(110,759,'Would you pause if your rival keeps going?',40,C.white,550)+footer(i);return s;
 }
 if(i===4){
  let s=head(i,'','Two endings in AI 2027.');
  s+=text(800,281,'Safety warning',32,C.ink,600,'text-anchor="middle"')+dot(800,318,8,C.ink)+arrow('M800 330v41H438v45',C.blue,4)+arrow('M800 371H1182v45',C.red,4);
  s+=box(76,430,704,338,C.white,18)+box(820,430,704,338,C.white,18);
  s+=text(108,487,'SLOWDOWN',30,C.blue,650)+text(852,487,'RACE',30,C.red,650);
  s+=person(142,552,C.blue)+person(209,552,C.blue)+person(276,552,C.blue);
  s+=path('M852 535h214v72H852z M852 559h214 M852 583h214',C.red,3)+dot(868,547,3,C.red)+dot(868,571,3,C.red)+dot(868,595,3,C.red);
  s+=text(108,662,'People keep control.',38,C.ink,600)+text(852,662,'People lose control.',38,C.ink,600);
  s+=text(108,720,'Power stays with a small committee.',28,C.muted)+text(852,720,'Dependence makes stopping harder.',28,C.muted)+footer(i);return s;
 }
 if(i===5){
  let s=head(i,'','Less time between each breakthrough.');
  s+=path('M142 320V710H1030',C.line,2)+text(146,764,'Time',28,C.muted)+text(146,294,'Possible AI capability',28,C.muted);
  s+=`<path d="M160 702C450 701 677 685 795 594S925 418 946 280L952 250L952 710H160Z" fill="${C.pale}"/>`+path('M160 702C450 701 677 685 795 594S925 418 946 280L952 250',C.blue,7,'marker-end="url(#arrow-blue)"')+text(224,641,'Gradual gains',30,C.ink,550)+text(621,447,'Faster cycles',32,C.blue,600);
  ['Better AI','More research','Better AI'].forEach((label,j)=>{const y=365+j*137;s+=text(1110,y,label,34,C.ink,600);if(j<2)s+=arrow(`M1260 ${y+28}v51`,C.blue,3);});
  s+=text(1110,772,'Less time to check.',30,C.red,550)+footer(i);return s;
 }
 if(i===9&&state.round<0){
  let s=head(i,'','Your side decides.');
  [['01','Join a side','Scan the code.'],['02','Read your role','Your brief appears in round 1.'],['03','Stay ahead','Cooperate or Race.']].forEach(([n,a,b],j)=>{const y=365+j*143;s+=text(76,y,n,32,C.blue,650)+text(158,y,a,38,C.ink,600)+text(158,y+50,b,30,C.muted);});
  if(options.qrURL){s+=box(1004,239,512,512,C.white,16)+`<image href="${options.qrURL.replace(/&/g,'&amp;')}" x="1020" y="255" width="480" height="480"/>`+text(1258,795,options.roomCode||'',32,C.blue,650,'text-anchor="middle"');}
  else{s+=tower(1070,352,155,C.blue)+tower(1300,352,155,C.red)+text(1070,643,'OpenBrain',30,C.blue,650)+text(1300,643,'DeepCent',30,C.red,650);}
  s+=footer(i);return s;
 }
 if(i===7){
  let s=head(i,'','Release before safety checks?');
  const cards=[{x:76,name:'CONSEQUENTIALISM',q:'Who benefits?\nWho bears harm?',a:'Weigh benefits and harms.'},{x:576,name:'DEONTOLOGY',q:'Which rights\nmust hold?',a:'Do not hide failed tests.'},{x:1076,name:'VIRTUE ETHICS',q:'What would an\nhonest leader do?',a:'Admit doubt. Seek a check.'}];
  for(const p of cards){s+=box(p.x,310,448,398,C.white,18)+text(p.x+24,370,p.name,28,C.blue,650)+text(p.x+24,468,p.q,36,C.ink,600)+path(`M${p.x+24} 559h400`,C.line,1)+text(p.x+24,618,p.a,28,C.muted);}
  s+=footer(i);return s;
 }
 if(i===10){
  let s=head(i,'','Make cooperation safer than racing.');
  const points=[{x:76,label:'Agree shared rules',kind:'rules'},{x:576,label:'Allow inspections',kind:'check'},{x:1076,label:'Make cheating costly',kind:'cost'}];
  for(const p of points){
   s+=text(p.x+224,646,p.label,34,C.ink,600,'text-anchor="middle"');
   if(p.kind==='rules'){
    s+=box(p.x+52,342,126,126,C.pale,18)+text(p.x+115,426,'A',58,C.blue,650,'text-anchor="middle"');
    s+=box(p.x+270,342,126,126,'#FFE8E1',18)+text(p.x+333,426,'B',58,C.red,650,'text-anchor="middle"');
    s+=arrow(`M${p.x+189} 384h65`,C.blue,4)+arrow(`M${p.x+254} 430h-65`,C.red,4);
    s+=path(`M${p.x+115} 490v55h218v-55`,C.blue,4);
   }
   if(p.kind==='check'){
    s+=path(`M${p.x+122} 324h165v218H${p.x+122}z`,C.blue,4);
    s+=path(`M${p.x+156} 373h85M${p.x+156} 415h60`,C.line,4);
    s+=`<circle cx="${p.x+282}" cy="475" r="59" fill="${C.bg}" stroke="${C.blue}" stroke-width="5"/>`+path(`M${p.x+326} 519l48 48`,C.blue,8)+path(`M${p.x+255} 475l19 20 37-42`,C.blue,5);
   }
   if(p.kind==='cost'){
    s+=path(`M${p.x+224} 326l113 45v90c0 66-65 111-113 139-48-28-113-73-113-139v-90z`,C.blue,5);
    s+=path(`M${p.x+224} 378v91`,C.red,8)+dot(p.x+224,505,6,C.red);

   }
  }
  s+=text(800,757,'Would you accept these checks if your rival had to accept them too?',32,C.blue,550,'text-anchor="middle"')+footer(i);return s;
 }
 return null;
}
