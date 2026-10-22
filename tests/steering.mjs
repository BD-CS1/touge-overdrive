import assert from 'node:assert/strict';
import {lookAt} from '../dist/renderer.js';
import {Race} from '../dist/race.js';

const transform=(m,p)=>[0,1,2].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+m[12+i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
for(const yaw of [0,Math.PI/2,-Math.PI/2,1.17,Math.PI]){
  for(const pitch of [0,.08,-.08]){
    const eye=[50,10,-20],forward=[Math.sin(yaw),pitch,Math.cos(yaw)],right=[Math.cos(yaw),0,-Math.sin(yaw)];
    const ahead=add(eye,forward.map(v=>v*30)),m=lookAt(eye,add(eye,forward));
    const r=transform(m,add(ahead,right.map(v=>v*2)));
    const l=transform(m,add(ahead,right.map(v=>v*-2)));
    assert(r[0]>0,'A roadside marker on the right must appear on screen right');
    assert(l[0]<0,'A roadside marker on the left must appear on screen left');
    assert(transform(m,add(ahead,[0,5,0]))[1]>0,'The view must remain upright');
    assert(r[2]<0&&l[2]<0,'Forward geometry must be in front of the perspective camera');
  }
}

const straight={length:1000,id:0,grip:1,at:s=>({x:0,y:0,z:s,a:0,curve:0})};
for(const direction of ['left','right']){
  const r=new Race(straight,0,'time',true,false);r.x=0;r.speed=20;
  for(let i=0;i<36;i++)r.update(1/120,{[direction]:true,gas:true});
  const sign=direction==='right'?1:-1;
  assert(r.x*sign>0,'Steering must move the car toward the pressed direction');
  assert(r.steer*sign>0,'The steering wheel must rotate toward the pressed direction');
  const eye=[r.x,1.23,r.s],yaw=r.angle*.7;
  const m=lookAt(eye,add(eye,[Math.sin(yaw),0,Math.cos(yaw)]));
  const center=transform(m,[0,0,r.s+30]);
  assert(center[0]*sign<0,'As the car turns, the road must move across the windscreen in the opposite direction');
}
console.log('PASS: left/right scene projection, upright pitched views, rear camera and steering-to-screen direction.');
