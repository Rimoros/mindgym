/* Browser integration tests against the actual production UI.
   Open browser.html via a static server. Uses a disposable test storage snapshot,
   restores it afterwards. No production test hooks or seeded demo statistics. */
const output=document.querySelector('#results'),status=document.querySelector('#status'),frame=document.querySelector('iframe');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let passed=0;
function line(s){output.textContent+=s+'\n';status.textContent=`${passed} checks passed`;}function assert(value,message){if(!value)throw Error(message);passed++;line('PASS '+message);}
const doc=()=>frame.contentDocument;
const find=s=>doc().querySelector(s);
const click=s=>{const el=find(s);if(!el)throw Error('Missing '+s);el.click();};
const score=()=>Number(find('#header-points').textContent);
const select=(s,v)=>{const el=find(s);el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}));};
async function ready(){for(let i=0;i<200;i++){if(find('#exercise'))return;await sleep(25);}throw Error('UI did not load');}
function input(v){const el=find('#answer');el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));}
function submit(){let form=find('#answer-form');if(form)form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));else if(find('[data-action="check"]'))click('[data-action="check"]');}
async function answer(kind,wrong=false){let answer;
 if(['digits','pattern','objects'].includes(kind)){
  click('[data-action="begin"]');
  if(kind==='digits')answer=find('.number-display').textContent.trim();
  if(kind==='pattern')answer=[...doc().querySelectorAll('.tile.reveal')].map(el=>el.dataset.cell);
  if(kind==='objects')answer=[...doc().querySelectorAll('.tile')].filter(el=>el.textContent).map(el=>({i:el.dataset.cell,text:el.textContent}));
  for(let i=0;i<800;i++){if(find('#answer')||find('.tile:not(:disabled)'))break;await sleep(30);}
  const emptyScore=score();submit();assert(!!find('#answer-error').textContent,`${kind}: empty memory answer validation`);assert(score()===emptyScore,`${kind}: empty answer has no penalty`);
  if(kind==='objects'){let target=find('.small strong').textContent;answer=answer.find(el=>el.text===target).i;}
 }
 if(['sequence','rule'].includes(kind)){
  if(kind==='sequence'){let a=[...doc().querySelectorAll('.sequence span')].slice(0,-1).map(x=>Number(x.textContent)),l=find('[data-level][aria-pressed="true"]')?.dataset.level||find('.exercise-top').textContent.match(/\/ (Easy|Medium|Hard)/)[1].toLowerCase();answer=l==='easy'?a.at(-1)+a[1]-a[0]:l==='medium'?a.at(-1)+2*a.at(-1)-3*a.at(-2)+a.at(-3):a.at(-1)*(a[1]/a[0]);}
  else{let pairs=[...doc().querySelectorAll('.rule-pairs span')].map(x=>x.textContent),values=pairs.slice(0,3).map(x=>Number(x.split('→')[1])),q=Number(pairs[3].split('→')[0]),a=(values[2]-2*values[1]+values[0])/2,b=values[1]-values[0]-3*a,c=values[0]-a-b;answer=a*q*q+b*q+c;}
 }
 if(['digits','sequence','rule'].includes(kind)){input(wrong?'999999999999999':answer);submit();return;}
 if(['odd','search'].includes(kind)){const cells=[...doc().querySelectorAll('.tile')];if(kind==='odd'){const counts={};cells.forEach(c=>counts[c.textContent]=(counts[c.textContent]||0)+1);answer=cells.find(c=>counts[c.textContent]===1).dataset.cell;}else{const target=find('.instruction').textContent.match(/“(.*?)”/)[1];answer=cells.filter(c=>c.textContent===target).map(c=>c.dataset.cell);}}
 if(kind==='deduction'){const clues=[...doc().querySelectorAll('.clues li')].map(c=>c.textContent);answer=[...doc().querySelectorAll('[data-choice]')].map(el=>Number(el.dataset.choice)).find(n=>clues.every(c=>{if(c.includes('odd'))return n%2===1;if(c.includes('even'))return n%2===0;if(c.includes('greater')){const [a,b]=c.match(/\d+/g).map(Number);return n>a&&n<b;}const [a,b]=c.match(/\d+/g).map(Number);return n%a===b;}));}
 if(kind==='color'){const colors=['Blue','Red','Green','Purple'],target=find('.color-target');answer=Number(target.className.match(/ink-(\d)/)[1]);}
 if(['pattern','search'].includes(kind)){if(wrong){const n=[...doc().querySelectorAll('.tile')].find(el=>!answer.includes(el.dataset.cell));n.click();}else answer.forEach(n=>click(`[data-cell="${n}"]`));}
 else if(['color','deduction'].includes(kind)){let options=[...doc().querySelectorAll('[data-choice]')];(wrong?options.find(el=>Number(el.dataset.choice)!==Number(answer)):options.find(el=>Number(el.dataset.choice)===Number(answer))).click();}
 else {let n=wrong?[...doc().querySelectorAll('.tile')].find(el=>el.dataset.cell!==String(answer)).dataset.cell:answer;click(`[data-cell="${n}"]`);}
 submit();
}
document.querySelector('#run').onclick=async()=>{document.querySelector('#run').disabled=true;const key='mindgym_product_v5',backup=localStorage.getItem(key);try{localStorage.removeItem(key);frame.src=frame.dataset.src+'#train';await new Promise(r=>frame.onload=r);await ready();
 const games={memory:['digits','pattern','objects'],attention:['odd','search','color'],logic:['sequence','rule','deduction']};
 for(const [skill,kinds]of Object.entries(games))for(const level of ['easy','medium','hard'])for(const kind of kinds)for(const wrong of [false,true]){
  click('[data-action="restart"]');click(`[data-skill="${skill}"]`);click(`[data-level="${level}"]`);select('#exercise-select',kind);const before=score();
  if(skill!=='memory'){submit();assert(!!find('#answer-error').textContent,`${kind}/${level}: empty answer validation`);assert(score()===before,`${kind}/${level}: empty answer has no penalty`);}
  await answer(kind,wrong);assert(!!find(wrong?'.feedback.wrong':'.feedback:not(.wrong)'),`${kind}/${level}: ${wrong?'incorrect':'correct'} answer feedback`);
  assert(score()-before===(wrong?-5:{easy:2,medium:4,hard:6}[level]),`${kind}/${level}: exact point change`);
  const after=score();submit();assert(score()===after,`${kind}/${level}: duplicate submission blocked`);
 }
 // Restart while the timer is running, then wait for the old callback.
 click('[data-action="restart"]');click('[data-skill="memory"]');click('[data-level="hard"]');select('#exercise-select','digits');click('[data-action="begin"]');click('[data-level="easy"]');select('#exercise-select','pattern');await sleep(3200);assert(!!find('[data-action="begin"]'),'Canceled memory timer cannot change a new round');
 // Complete a five-round session in the actual UI.
 click('[data-action="restart"]');click('[data-skill="logic"]');select('#exercise-select','sequence');for(let i=0;i<5;i++){await answer('sequence');click('[data-action="next"]');}assert(find('#exercise').textContent.includes('Practice, complete.'),'Five-round session summary');click('[data-action="restart"]');assert(!!find('#answer-form'),'Session can be restarted');
 // Begin, interrupt, reload, resume and complete a fixed weekly assessment.
 frame.contentWindow.location.hash='weekly';await sleep(70);click('[data-action="weekly-start"]');click('[data-action="begin"]');let stored=JSON.parse(localStorage.getItem(key));const firstID=stored.activeWeekly.rounds[0].id;frame.contentWindow.location.reload();await new Promise(r=>frame.onload=r);await sleep(70);assert(!!find('[data-action="begin"]'),'Interrupted weekly observation returns to ready');assert(JSON.parse(localStorage.getItem(key)).activeWeekly.rounds[0].id===firstID,'Reload keeps the same weekly question');
 for(const kind of ['digits','pattern','objects','odd','search','color','sequence','rule','deduction']){await answer(kind);if(kind!=='deduction')click('[data-action="next"]');}
 assert(find('main').textContent.includes('CHECK-IN COMPLETE'),'Weekly assessment completes');assert(!find('[data-action="weekly-start"]'),'Seven-day lock hides restart action');stored=JSON.parse(localStorage.getItem(key));assert(stored.weekly.length===1&&stored.weekly[0].results.filter(r=>r.correct).length===9,'Weekly saves all nine correct results');assert(stored.activeWeekly===null,'Completed assessment clears active attempt');
 frame.contentWindow.location.reload();await new Promise(r=>frame.onload=r);await sleep(70);assert(!find('[data-action="weekly-start"]'),'Weekly cooldown survives reload');frame.contentWindow.location.hash='progress';await sleep(70);assert(!!find('.chart'),'Progress chart is built from actual attempts');assert(doc().querySelectorAll('.history tbody tr').length>0,'History displays saved attempts');select('#history-skill','attention');assert([...doc().querySelectorAll('.history:first-of-type tbody tr')].some(r=>r.textContent.includes('Attention')),'History filter updates results');
 line(`COMPLETE — ${passed} checks passed. No failures.`);
 }catch(error){status.textContent='FAILED';line('FAIL '+error.stack+'\nUI: '+doc().querySelector('main')?.textContent);status.textContent='FAILED';}finally{if(backup===null)localStorage.removeItem(key);else localStorage.setItem(key,backup);line('Original browser progress restored.');document.querySelector('#run').disabled=false;}};
