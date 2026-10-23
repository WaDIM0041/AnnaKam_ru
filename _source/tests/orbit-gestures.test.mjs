import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function scene(){
 const handlers={},frames=[];
 const links=Array.from({length:12},()=>({matches:()=>false,addEventListener(){}}));
 const items=links.map(link=>({style:{},getBoundingClientRect:()=>({width:122}),querySelector:()=>link}));
 const stage={clientWidth:339,clientHeight:560,addEventListener:(name,fn)=>handlers[name]=fn,setPointerCapture(){},hasPointerCapture:()=>false,classList:{add(){},remove(){}},contains:()=>false};
 const pause={setAttribute(){},querySelector:()=>({}),addEventListener(){}};
 const root={querySelector:s=>s.includes('stage')?stage:pause,querySelectorAll:s=>s.includes('item')?items:[],classList:{add(){}}};
 vm.runInNewContext(fs.readFileSync(new URL('../project-orbits.js',import.meta.url),'utf8'),{
  document:{querySelector:()=>root,hidden:false,activeElement:null,addEventListener(){}},window:{addEventListener(){}},matchMedia:()=>({matches:true,addEventListener(){}}),getComputedStyle:()=>({width:'122px'}),requestAnimationFrame:fn=>{frames.push(fn);return frames.length},cancelAnimationFrame(){},
  ResizeObserver:class{constructor(cb){this.cb=cb}observe(){this.cb()}},IntersectionObserver:class{constructor(cb){this.cb=cb}observe(){this.cb([{isIntersecting:true}])}}
 });
 let now=0;const draw=()=>{const frame=frames.shift();if(frame)frame(now+=16);};draw();
 const pointer=(name,x,y,time=100)=>handlers[name]({isPrimary:true,pointerType:'touch',pointerId:1,clientX:x,clientY:y,timeStamp:time});
 return{items,pointer,draw,click(){let prevented=false;handlers.click({preventDefault(){prevented=true},stopPropagation(){}});return prevented;}};
}
test('a short horizontal touch swipe visibly rotates the mobile collection',()=>{
 const s=scene(),before=s.items.map(i=>i.style.transform);
 s.pointer('pointerdown',100,100);s.pointer('pointermove',200,105,150);s.pointer('pointerup',200,105,160);s.draw();
 const distances=s.items.map((item,i)=>{const position=t=>Number(t.match(/translate\(([-\d.]+)px/)[1]);return Math.abs(position(item.style.transform)-position(before[i]));});
 assert(Math.max(...distances)>60,'100px swipe should substantially move the previews');assert.equal(s.click(),true,'swipe must not open a project');
});
test('vertical touch movement preserves page scrolling and taps still open links',()=>{
 const s=scene(),before=s.items.map(i=>i.style.transform);
 s.pointer('pointerdown',100,100);s.pointer('pointermove',103,180,150);s.pointer('pointerup',103,180,160);s.draw();
 assert.deepEqual(s.items.map(i=>i.style.transform),before);assert.equal(s.click(),false);
 s.pointer('pointerdown',100,100);s.pointer('pointerup',100,100,180);assert.equal(s.click(),false);
});
test('touch rotation covers the same distance with sparse or frequent move events',()=>{
 const sparse=scene(),dense=scene();
 for(const s of [sparse,dense])s.pointer('pointerdown',100,100);
 sparse.pointer('pointermove',200,100,150);
 for(let x=110;x<=200;x+=10)dense.pointer('pointermove',x,100,100+(x-100)/2);
 for(const s of [sparse,dense]){s.pointer('pointerup',200,100,160);s.draw();}
 assert.deepEqual(dense.items.map(i=>i.style.transform),sparse.items.map(i=>i.style.transform));
});
