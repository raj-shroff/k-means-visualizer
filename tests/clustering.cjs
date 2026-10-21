const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes=new Map();
const node=()=>({style:{},classList:{toggle(){},contains(){return false;}},dataset:{},clientWidth:650,innerHTML:'',textContent:'',value:'',checked:true,add(){},setAttribute(){},addEventListener(){},appendChild(){},scrollIntoView(){}});
const context={document:{querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll(){return [];},createElementNS(){return node();}},Option:function(){},ResizeObserver:class{observe(){}},matchMedia:()=>({matches:true}),requestAnimationFrame:fn=>fn(),window:{},console};
vm.createContext(context);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
const app=context.window.clusterDemo,sq=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
let runs=0;
for(const k of [2,3,4])for(let seed=0;seed<20;seed++){
 app.setK(k);app.setSeed(seed);let last=Infinity;
 for(const state of app.states){
  if(state.cost!==undefined){assert(state.cost<=last+1e-10,'Objective increased');last=state.cost;}
  if(['assign','done'].includes(state.type))state.labels.forEach((label,i)=>assert(sq(app.data[i],state.centers[label])<=Math.min(...state.centers.map(c=>sq(app.data[i],c)))+1e-10));
  if(state.type==='move')state.centers.forEach((c,j)=>{const points=app.data.filter((p,i)=>state.labels[i]===j);if(points.length){assert(Math.abs(c.x-points.reduce((s,p)=>s+p.x,0)/points.length)<1e-10);assert(Math.abs(c.y-points.reduce((s,p)=>s+p.y,0)/points.length)<1e-10);}});
 }
 assert.equal(app.states.at(-1).type,'done');assert.equal(app.states.at(-1).changed,0);runs++;
}
app.setK(3);app.setSeed(0);console.log(JSON.stringify({passed:runs,defaultSteps:app.states.length,defaultClusterSizes:app.states.at(-1).centers.map((_,j)=>app.states.at(-1).labels.filter(v=>v===j).length)}));
