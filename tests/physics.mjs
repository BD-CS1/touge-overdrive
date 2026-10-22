import assert from 'node:assert/strict';
import {Track} from '../dist/world.js';
import {Race} from '../dist/race.js';
const tracks=[0,1,2].map(i=>new Track(i));
for(const t of tracks){assert(t.chunks.length>20);assert(t.chunks.every(c=>c.geometry.v.every(Number.isFinite)));const r=new Race(t,0,'time',true,true);for(let i=0;i<960;i++)r.update(1/120,{});const speed=r.speed;for(let i=0;i<240;i++)r.update(1/120,{brake:true});assert(r.speed<speed*.2);assert.equal(r.opponents.length,0)}
const t=tracks[0],r=new Race(t,0,'race');assert.equal(r.opponents.length,7);r.x=5;r.speed=30;r.update(1/120,{});assert(r.x<=4.02);assert(r.health<100);r.s=t.length-1;r.speed=30;r.update(.05,{});assert(r.done);assert.equal(r.s,t.length);
const manual=new Race(t,0,'time',true,false);for(let i=0;i<600;i++)manual.update(1/120,{});assert(manual.speed<1);for(let i=0;i<600;i++)manual.update(1/120,{gas:true});assert(manual.speed>10);
// A simple feedback driver completes all courses, testing the entire race lifecycle.
for(const t of tracks){let r=new Race(t,2,'race',true,true);for(let i=0;i<120*500&&!r.done;i++){let p=t.at(r.s),comp=p.curve*r.speed*r.speed*.10,target=clamp(-r.x*1.8+comp,-r.speed*.216,r.speed*.216),turn=target>1?'right':target<-1?'left':null;let safe=Math.sqrt(t.grip*12/Math.max(.001,Math.abs(t.at(r.s+60).curve)));r.update(1/120,{left:turn==='left',right:turn==='right',brake:r.speed>safe+1});assert(Number.isFinite(r.s)&&Number.isFinite(r.speed));}assert(r.done,`course ${t.id} did not finish`);assert(r.place>=1&&r.place<=8);console.log(`${t.name}: finished ${r.time.toFixed(1)} s, rank ${r.place}, body ${r.health.toFixed(0)}%`)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
console.log('PASS: geometry, dry/wet/fog braking, manual throttle, collision, seven rivals, finish and complete races.');
