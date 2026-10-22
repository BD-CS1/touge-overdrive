export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export function seedRandom(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
export const tracks=[{name:'曙光・赤城嶺',length:4800,weather:'dry',label:'DRY · 乾燥路面',grip:1,sky:[.27,.39,.48],fog:[.34,.43,.46],light:[1,.81,.61],fogDensity:.00085},{name:'雨夜・黑松峠',length:5600,weather:'rain',label:'WET · 濕滑路面',grip:.68,sky:[.025,.045,.085],fog:[.045,.075,.11],light:[.38,.53,.74],fogDensity:.0016},{name:'霧境・白峰線',length:5200,weather:'fog',label:'FOG · 山霧低能見度',grip:.83,sky:[.42,.51,.53],fog:[.5,.57,.57],light:[.78,.88,.9],fogDensity:.0052}];
export class Track{
 constructor(id=0){Object.assign(this,tracks[id]);this.id=id;this.step=8;this.points=[];let x=0,z=0;const phase=id*.9;for(let s=0;s<=this.length+1400;s+=this.step){let a=1.02*Math.sin(s/310+phase)+.37*Math.sin(s/107+phase*.7);if(id===1)a+=.16*Math.sin(s/54);let y=80-s*.014+15*Math.sin(s/470)+7*Math.sin(s/157+phase);this.points.push({x,y,z,a,s});x+=Math.sin(a)*this.step;z+=Math.cos(a)*this.step}this.chunks=[];this.build()}
 at(s,offset=0){s=clamp(s,0,this.length+1300);const i=Math.min(this.points.length-2,Math.floor(s/this.step)),t=s/this.step-i,p=this.points[i],q=this.points[i+1],a=lerp(p.a,q.a,t);return{x:lerp(p.x,q.x,t)+Math.cos(a)*offset,y:lerp(p.y,q.y,t),z:lerp(p.z,q.z,t)-Math.sin(a)*offset,a,curve:(q.a-p.a)/this.step,s}}
 build(){const rnd=seedRandom(47+this.id*177);for(let start=0;start<this.points.length-1;start+=20){const g=new Geometry;for(let j=start;j<Math.min(start+20,this.points.length-1);j++){let p=this.points[j],q=this.points[j+1];const v=(p,o,y=0)=>[p.x+Math.cos(p.a)*o,p.y+y,p.z-Math.sin(p.a)*o];
 // Continuous 8 m asphalt, shoulders, painted edges and centre lines.
 g.quad(v(p,-4),v(q,-4),v(q,4),v(p,4),[.13,.155,.17]);
 for(let side of [-1,1]){g.quad(v(p,side*4,.01),v(q,side*4,.01),v(q,side*4.55),v(p,side*4.55),j%4<2?[.69,.69,.61]:[.23,.28,.26]);g.quad(v(p,side*3.78,.025),v(q,side*3.78,.025),v(q,side*3.85,.025),v(p,side*3.85,.025),[.79,.83,.77]);g.quad(v(p,side*4.55,-.05),v(q,side*4.55,-.05),v(q,side*10,-.1),v(p,side*10,-.1),[.22,.27,.19]);
 // Terrain follows the mountain road, rising uphill on the left, falling into the valley on the right.
 const widths=[10,22,50,100,190],heights=side<0?[-.1,4,16,38,72]:[-.1,-7,-20,-37,-42];for(let w=0;w<widths.length-1;w++){let col=side<0?[.17+w*.007,.23+w*.008,.16+w*.009]:[.16,.24,.19];g.quad(v(p,side*widths[w],heights[w]),v(q,side*widths[w],heights[w]),v(q,side*widths[w+1],heights[w+1]),v(p,side*widths[w+1],heights[w+1]),col)}
 // Guardrail, reflectors and stanchions.
 let rail=side*4.8;g.quad(v(p,rail,.55),v(q,rail,.55),v(q,rail,.84),v(p,rail,.84),[.48,.54,.53]);g.quad(v(p,rail,.84),v(q,rail,.84),v(q,rail+side*.1,.84),v(p,rail+side*.1,.84),[.68,.72,.65]);if(j%2===0){let r=v(p,rail);g.box(r[0],r[1]+.4,r[2],.09,.8,.09,[.3,.36,.34],p.a);g.box(r[0]+Math.cos(p.a)*-.08*side,r[1]+.72,r[2]+Math.sin(p.a)*.08*side,.1,.11,.07,side<0?[1,.64,.22]:[.7,.92,.85],p.a)}
 if(j%3===0){const off=side*(9+rnd()*22),t=v(p,off,side<0?Math.max(0,(Math.abs(off)-10)*.25):-Math.max(0,(Math.abs(off)-10)*.45));g.tree(t[0],t[1],t[2],7+rnd()*9,.7+rnd()*.5,rnd)}
 if(j%7===0){let t=v(p,side*(7+rnd()*5));g.rock(t[0],t[1],t[2],.5+rnd()*1.8,[.3,.34,.29]);}
 }
 if(j%5<3)for(let side of [-1,1])g.quad(v(p,side*.10,.028),v(q,side*.10,.028),v(q,side*.17,.028),v(p,side*.17,.028),[.94,.65,.22]);
 // Chevron boards on the outside of sharper bends.
 let cur=(q.a-p.a)/8;if(j%5===0&&Math.abs(cur)>.0055){let side=cur>0?-1:1,t=v(p,side*5.35);g.box(t[0],t[1]+1.6,t[2],1.1,.55,.09,[.85,.7,.2],p.a);g.box(t[0],t[1]+.65,t[2],.07,1.3,.07,[.3,.35,.33],p.a);let right=[Math.cos(p.a),0,-Math.sin(p.a)],fwd=[Math.sin(p.a),0,Math.cos(p.a)];let poly=(x,y)=>[t[0]+right[0]*x-fwd[0]*.06,t[1]+1.6+y,t[2]+right[2]*x-fwd[2]*.06];g.quad(poly(-side*.28,-.21),poly(side*.05,-.21),poly(side*.33,0),poly(0,0),[.07,.09,.08]);g.quad(poly(0,0),poly(side*.33,0),poly(side*.05,.21),poly(-side*.28,.21),[.07,.09,.08]);}
 // Street lights around turn entries.
 if(j%20===3){let t=v(p,-5.5);g.box(t[0],t[1]+3.9,t[2],.12,7.8,.12,[.24,.3,.32]);g.box(t[0]+1.1*Math.cos(p.a),t[1]+7.8,t[2]-1.1*Math.sin(p.a),2.3,.12,.13,[.3,.35,.36],p.a);g.box(t[0]+2*Math.cos(p.a),t[1]+7.7,t[2]-2*Math.sin(p.a),.75,.08,.4,[1,.9,.63],p.a);}
 }this.chunks.push({s:start*8,end:(start+20)*8,geometry:g})}
 // Finish gantry across both lanes.
 const g=new Geometry,p=this.at(this.length);for(let side of [-1,1]){let o=this.at(this.length,side*5);g.box(o.x,o.y+3,o.z,.28,6,.28,[.4,.48,.47],p.a)}g.box(p.x,p.y+6,p.z,10.3,1,.32,[.09,.14,.18],p.a);for(let i=0;i<20;i++){let o=this.at(this.length,(i-9.5)*.48);g.box(o.x,o.y+6,o.z-.19,.47,.42,.03,i%2?[.88,.92,.88]:[.12,.17,.19],p.a)}this.chunks.push({s:this.length-200,end:this.length+100,geometry:g})
 }
}
export class Geometry{
 constructor(){this.v=[]}
 tri(a,b,c,col){const u=b.map((x,i)=>x-a[i]),v=c.map((x,i)=>x-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;n=n.map(x=>x/l);if(n[1]<0)n=n.map(x=>-x);for(const p of[a,b,c])this.v.push(...p,...n,...col)}
 quad(a,b,c,d,col){this.tri(a,b,c,col);this.tri(a,c,d,col)}
 box(x,y,z,w,h,d,col,a=0){let r=(u,v,q)=>[x+u*Math.cos(a)+q*Math.sin(a),y+v,z-u*Math.sin(a)+q*Math.cos(a)];let p=[r(-w/2,-h/2,-d/2),r(w/2,-h/2,-d/2),r(w/2,h/2,-d/2),r(-w/2,h/2,-d/2),r(-w/2,-h/2,d/2),r(w/2,-h/2,d/2),r(w/2,h/2,d/2),r(-w/2,h/2,d/2)];for(let f of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])this.quad(...f.map(i=>p[i]),col)}
 cone(x,y,z,r,h,col,n=7){let top=[x,y+h,z];for(let i=0;i<n;i++){let a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2;this.tri([x+Math.cos(a)*r,y,z+Math.sin(a)*r],top,[x+Math.cos(b)*r,y,z+Math.sin(b)*r],col)}}
 tree(x,y,z,h,s,rnd){this.box(x,y+h*.25,z,.35,h*.5,.35,[.18,.16,.12]);let c=[.075+rnd()*.06,.16+rnd()*.05,.115+rnd()*.04];for(let k=0;k<6;k++)this.cone(x+Math.sin(k*2.4)*.12,y+h*(.12+k*.125),z+Math.cos(k*2.4)*.12,(2.6-k*.33)*s,h*(.36-k*.015),c.map(v=>v*(.86+k*.032)),10)}
 rock(x,y,z,s,col){this.cone(x,y-.1,z,s,s*1.3,col,5)}
}
export function carGeometry(color){let g=new Geometry,shade=k=>color.map(v=>v*k),black=[.035,.045,.055],glass=[.07,.145,.19];g.box(0,.48,0,1.77,.46,4.1,shade(.92));g.box(0,.77,0,1.69,.17,3.94,color);
// Sloped glass, roof and shaped side windows of the coupe.
g.quad([-.75,.85,-1.1],[.75,.85,-1.1],[.68,1.29,-.63],[-.68,1.29,-.63],glass);g.quad([-.68,1.29,.62],[.68,1.29,.62],[.76,.85,1.24],[-.76,.85,1.24],glass);g.box(0,1.30,-.02,1.42,.09,1.37,color);for(let side of[-1,1]){g.quad([side*.76,.86,-1.04],[side*.69,1.28,-.6],[side*.69,1.28,.58],[side*.77,.86,1.18],glass);g.box(side*.75,1.07,-.10,.045,.43,.065,shade(.7));g.box(side*.78,.88,.26,.035,.035,.28,[.55,.6,.6]);g.box(side*.89,.98,.73,.22,.12,.25,color);
// Round tyres, alloy hubs and subtle side skirts.
for(let z of[-1.31,1.28]){let x=side*.84;for(let ring of[{r:.34,w:.23,c:black},{r:.23,w:.245,c:[.47,.51,.52]},{r:.105,w:.252,c:[.18,.21,.23]}]){for(let k=0;k<12;k++){let a=k/12*Math.PI*2,b=(k+1)/12*Math.PI*2,point=(xx,ang)=>[x+xx,.34+Math.cos(ang)*ring.r,z+Math.sin(ang)*ring.r];g.quad(point(-ring.w/2,a),point(ring.w/2,a),point(ring.w/2,b),point(-ring.w/2,b),ring.c);g.tri([x+side*ring.w/2,.34,z],point(side*ring.w/2,a),point(side*ring.w/2,b),ring.c)}}}g.box(side*.87,.28,0,.08,.12,2.25,shade(.6));g.box(side*.58,.72,-2.076,.54,.15,.035,[1,.10,.065]);g.box(side*.58,.72,2.079,.53,.17,.04,[.94,.97,.85]);g.box(side*.63,1.01,-1.78,.07,.34,.08,black)}g.box(0,1.19,-1.8,1.87,.075,.35,color);g.box(0,.51,-2.08,1.7,.12,.09,black);g.box(0,.51,2.08,1.7,.12,.09,black);g.box(0,.71,-2.10,.39,.12,.025,[.86,.9,.83]);g.box(.6,.29,-2.11,.16,.12,.18,[.45,.5,.52]);return g}
