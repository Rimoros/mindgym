const assert=require('node:assert/strict');
const M=require('../dist/core.js');let count=0;
const test=(name,fn)=>{fn();count++;};
for(const skill of M.SKILLS)for(const level of M.LEVELS)for(const [kind]of M.GAMES[skill])for(let i=0;i<50;i++){
 test(`${skill}/${level}/${kind} generation ${i}`,()=>{let r=M.makeRound(skill,level,kind);assert.equal(r.skill,skill);assert.equal(r.level,level);assert.equal(M.validate(r,r.answer).correct,true);assert.equal(M.validate(r,undefined).error!==undefined,true);let wrong=Array.isArray(r.answer)?[...r.answer,999]:typeof r.answer==='number'?r.answer+9999:r.answer+'0';assert.equal(M.validate(r,wrong).correct,false);if(r.kind==='deduction'){let matching=r.options.filter(n=>r.clues.every(c=>{if(c.includes('odd'))return n%2===1;if(c.includes('even'))return n%2===0;if(c.includes('greater')){let [lo,hi]=c.match(/\d+/g).map(Number);return n>lo&&n<hi;}let [div,rem]=c.match(/\d+/g).map(Number);return n%div===rem;}));assert.deepEqual(matching,[r.answer]);}if(r.kind==='search')assert.deepEqual(r.tiles.map((x,i)=>x===r.target?i:null).filter(x=>x!==null),r.answer);if(r.kind==='objects')assert.equal(r.symbols[r.positions.indexOf(r.answer)],r.target);});
}
test('Exact points and negative totals',()=>{assert.deepEqual(M.LEVELS.map(l=>M.points(l,true)),[2,4,6]);assert.deepEqual(M.LEVELS.map(l=>M.points(l,false)),[-5,-5,-5]);assert.equal(M.summary([{correct:false,points:-5}]).points,-5);});
test('Empty and invalid numbers',()=>{let r=M.makeRound('logic','easy','sequence');for(const a of ['',' ','abc','-1','1.3','1e3'])assert.ok(M.validate(r,a).error);});
test('Leading zeros are meaningful',()=>{let r=M.makeRound('memory','easy','digits');r.answer='0012';assert.equal(M.validate(r,'0012').correct,true);assert.equal(M.validate(r,'12').correct,false);});
test('Grid order does not matter',()=>{let r=M.makeRound('memory','hard','pattern');assert.ok(M.validate(r,[...r.answer].reverse()).correct);assert.ok(M.validate(r,[]).error);assert.equal(M.validate(r,r.answer.slice(1)).correct,false);});
test('Selection zero is valid',()=>{let r=M.makeRound('attention','easy','odd');r.answer=0;assert.equal(M.validate(r,0).correct,true);});
test('Calendar streak handles month boundaries and yesterday',()=>{const s=['2026-09-29','2026-09-30','2026-10-01'].map(d=>({date:d+'T12:00:00'}));assert.equal(M.streak(s,new Date('2026-10-01T18:00:00').getTime()),3);assert.equal(M.streak(s,new Date('2026-10-02T18:00:00').getTime()),3);assert.equal(M.streak(s,new Date('2026-10-03T18:00:00').getTime()),0);});
test('Missing data is not zero accuracy',()=>{assert.equal(M.summary([]).accuracy,null);});
test('Storage validation ignores invalid records',()=>{const b=M.clean({sessions:[null,{skill:'evil',date:'today',correct:true},{id:'1',skill:'memory',date:'2026-10-29',correct:true,level:'hard',points:999}]});assert.equal(b.sessions.length,1);assert.equal(b.sessions[0].points,6);assert.deepEqual(M.clean(null).sessions,[]);});
test('Cooldown is exactly 168 hours',()=>assert.equal(M.WEEK,168*60*60*1000));
test('Invalid game settings fail explicitly',()=>assert.throws(()=>M.makeRound('memory','impossible','digits')));
console.log(`PASS: ${count} tests, including 1,350 generated rounds across all 27 game/difficulty combinations.`);
