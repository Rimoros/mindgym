/* Pure exercise generators and scoring. No DOM or storage dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.MindGym=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const SKILLS=['memory','attention','logic'];
const LEVELS=['easy','medium','hard'];
const POINTS={easy:2,medium:4,hard:6};
const WEEK=604800000;
const GAMES={memory:[['digits','Number recall','Remember a sequence of digits.'],['pattern','Pattern recall','Rebuild a disappearing visual pattern.'],['objects','Object locations','Remember where each object belongs.']],attention:[['odd','Odd one out','Find the one symbol that differs.'],['search','Visual search','Find every matching target.'],['color','Color focus','Read the ink. Ignore the word.']],logic:[['sequence','Number sequences','Discover the rule and continue it.'],['rule','Rule machine','Work out an input–output rule.'],['deduction','Small deductions','Use the clues to find one answer.']]};
const int=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const sample=(n,max)=>shuffle(Array.from({length:max},(_,i)=>i)).slice(0,n);
function makeRound(skill,level,kind){
 if(!SKILLS.includes(skill)||!LEVELS.includes(level))throw Error('Invalid exercise settings');
 const d=LEVELS.indexOf(level);kind=kind||GAMES[skill][int(0,2)][0];
 if(!GAMES[skill].some(g=>g[0]===kind))throw Error('Invalid exercise type');
 const r={id:Date.now()+'-'+Math.random().toString(36).slice(2),skill,level,kind,status:skill==='memory'?'ready':'answer',selected:[],input:'',correct:null,exposure:[5000,4000,3000][d],title:GAMES[skill].find(g=>g[0]===kind)[1]};
 if(kind==='digits'){r.answer=Array.from({length:[4,6,8][d]},()=>int(0,9)).join('');r.instruction=`Remember all ${r.answer.length} digits in order, including any leading zero. Type them after they disappear.`;r.solution=`The sequence was ${r.answer}.`;}
 if(kind==='pattern'){r.size=[3,4,5][d];r.answer=sample([3,5,7][d],r.size*r.size).sort((a,b)=>a-b);r.instruction=`Remember the ${r.answer.length} highlighted cells. Select the same cells after the pattern disappears. Order does not matter.`;r.solution='The highlighted cells below show the original pattern.';}
 if(kind==='objects'){r.size=[3,4,5][d];const count=[3,5,7][d];r.positions=sample(count,r.size*r.size);r.symbols=shuffle(['★','●','▲','◆','■','✚','☀']).slice(0,count);const t=int(0,count-1);r.target=r.symbols[t];r.answer=r.positions[t];r.instruction=`Remember the locations of ${count} shapes. After they disappear, select the cell that held the requested shape.`;r.solution=`${r.target} was in row ${Math.floor(r.answer/r.size)+1}, column ${r.answer%r.size+1}.`;}
 if(kind==='odd'){r.size=[4,6,8][d];const pair=[['○','◉'],['E','F'],['b','d']][d];r.answer=int(0,r.size*r.size-1);r.tiles=Array.from({length:r.size*r.size},(_,i)=>i===r.answer?pair[1]:pair[0]);r.instruction='Select the one symbol that is different, then check your answer. There is no time limit.';r.solution=`The different symbol was ${pair[1]}, in row ${Math.floor(r.answer/r.size)+1}, column ${r.answer%r.size+1}.`;}
 if(kind==='search'){r.size=[4,6,8][d];r.target=['7','F','db'][d];r.answer=sample([3,5,8][d],r.size*r.size).sort((a,b)=>a-b);const decoys=[['1','2','9'],['E','P','T'],['bd','bb','dd']][d];r.tiles=Array.from({length:r.size*r.size},(_,i)=>r.answer.includes(i)?r.target:decoys[int(0,2)]);r.instruction=`Select every “${r.target}”. There are ${r.answer.length} matches; selecting extra cells counts as incorrect. No time limit.`;r.solution=`All ${r.answer.length} matching cells are highlighted below.`;}
 if(kind==='color'){const colors=['Blue','Red','Green','Purple'];r.answer=int(0,3);r.word=colors[(r.answer+int(1,3))%4];r.colors=colors;r.cues=Array.from({length:[1,3,5][d]},()=>({word:colors[int(0,3)],ink:int(0,3)}));r.cues[Math.floor(r.cues.length/2)]={word:r.word,ink:r.answer};r.instruction=`Choose the INK COLOR of the ${d===0?'word':'center word (marked with a dot)'}. Ignore what the word says${d===0?'':', and ignore the surrounding words'}.`;r.solution=`The ink color of the target was ${colors[r.answer]}.`;}
 if(kind==='sequence'){const a=int(1,9),b=int(2,5);if(d===0){r.series=[0,1,2,3].map(i=>a+i*b);r.answer=a+4*b;r.solution=`Add ${b} each time.`;}else if(d===1){r.series=[a,a+b,a+2*b+1,a+3*b+3,a+4*b+6];r.answer=a+5*b+10;r.solution=`The differences are ${b}, ${b+1}, ${b+2}, ${b+3}, then ${b+4}.`;}else{r.series=[a,a*b,a*b+1,(a*b+1)*b,(a*b+1)*b+1];r.answer=r.series[4]*b;r.solution=`Alternate ×${b} and +1. The next operation is ×${b}.`;}r.instruction='Find the simplest repeating rule. Enter the next number.';}
 if(kind==='rule'){const a=[int(2,4),int(3,6),int(2,4)][d],b=int(1,9);const f=x=>d===0?x+a:d===1?a*x+b:a*x*x+b;r.pairs=[1,2,3].map(x=>[x,f(x)]);r.query=int(4,6);r.answer=f(r.query);r.instruction='Use one consistent rule for all three pairs. What output belongs to the final input?';r.solution=d===0?`Output = input + ${a}.`:d===1?`Output = ${a} × input + ${b}.`:`Output = ${a} × input² + ${b}.`;}
 if(kind==='deduction'){const values=shuffle(Array.from({length:[8,12,16][d]},(_,i)=>i+1));r.answer=values[int(0,values.length-1)];r.options=values;const a=r.answer;let clues=[`It is ${a%2?'odd':'even'}.`];let lo=Math.max(0,a-[2,3,4][d]),hi=a+[2,3,4][d];clues.push(`It is greater than ${lo} and less than ${hi}.`);let candidates=values.filter(x=>x%2===a%2&&x>lo&&x<hi);if(candidates.length>1){const mod=[3,4,5,7,11,17].find(m=>candidates.filter(x=>x%m===a%m).length===1);clues.push(`Dividing it by ${mod} leaves remainder ${a%mod}.`);}r.clues=clues;r.instruction='Exactly one of the numbers below satisfies every clue. Select it and check.';r.solution=`${a} satisfies all the clues. Other choices fail at least one clue.`;}
 return r;
}
function validate(r,answer){
 if(['digits','sequence','rule'].includes(r.kind)){
  const s=String(answer??'').trim();if(!s)return {error:'Enter an answer before checking.'};
  if(!/^\d+$/.test(s))return {error:'Use whole numbers only.'};
  return {correct:r.kind==='digits'?s===r.answer:Number(s)===r.answer};
 }
 if(['pattern','search'].includes(r.kind)){if(!Array.isArray(answer)||!answer.length)return {error:'Select at least one cell before checking.'};const a=[...new Set(answer)].sort((a,b)=>a-b);return {correct:JSON.stringify(a)===JSON.stringify(r.answer)};}
 if(answer===null||answer===undefined||answer==='')return {error:'Make a selection before checking.'};
 return {correct:Number(answer)===r.answer};
}
const points=(level,correct)=>correct?POINTS[level]:-5;
const dayKey=date=>{const d=new Date(date);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function streak(sessions,now=Date.now()){
 const days=new Set(sessions.map(s=>dayKey(s.date)));let d=new Date(now);d.setHours(12,0,0,0);if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);let n=0;while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;
}
function summary(sessions){const total=sessions.length,correct=sessions.filter(s=>s.correct).length;return {total,correct,accuracy:total?Math.round(correct/total*100):null,points:sessions.reduce((n,s)=>n+(s.points||0),0)};}
function blank(){return {version:5,sessions:[],weekly:[],activeWeekly:null,legacy:null};}
function clean(raw){
 const b=blank();if(!raw||!Array.isArray(raw.sessions))return b;
 b.sessions=raw.sessions.filter(s=>s&&SKILLS.includes(s.skill)&&typeof s.correct==='boolean'&&Number.isFinite(Date.parse(s.date))).map(s=>({...s,points:LEVELS.includes(s.level)?points(s.level,s.correct):0}));
 b.weekly=Array.isArray(raw.weekly)?raw.weekly.filter(w=>w&&Number.isFinite(Date.parse(w.date))&&Array.isArray(w.results)&&w.results.length===9):[];
 if(raw.activeWeekly&&Array.isArray(raw.activeWeekly.rounds)&&raw.activeWeekly.rounds.length===9&&raw.activeWeekly.rounds.every(r=>r&&SKILLS.includes(r.skill)&&LEVELS.includes(r.level)&&GAMES[r.skill].some(g=>g[0]===r.kind)&&['ready','show','answer','result'].includes(r.status))){b.activeWeekly=raw.activeWeekly;}
 b.legacy=raw.legacy||null;return b;
}
return {SKILLS,LEVELS,POINTS,WEEK,GAMES,makeRound,validate,points,dayKey,streak,summary,blank,clean};
});
