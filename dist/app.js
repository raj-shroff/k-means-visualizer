(() => {
'use strict';
const $ = s => document.querySelector(s);
const data = [[18,2],[25,3],[32,2],[38,4],[42,3],[48,5],[55,4],[60,6],[28,4],[45,6],[115,3],[130,4],[142,3],[155,5],[168,4],[180,6],[190,5],[148,6],[125,5],[172,7],[68,12],[78,14],[85,16],[95,15],[105,18],[115,17],[125,19],[92,13],[110,15],[135,16]].map((p,i)=>({x:p[0]/200,y:p[1]/20,spend:p[0],visits:p[1],id:i+1}));
const colors=['#1261cf','#008578','#c76b1e','#8563b3'];
const glossary={"K":"The number of clusters. Select K before the calculation starts. K-means does not select K.","Feature":"A measured property of a customer. This example uses two features: monthly spending and number of visits.","Cluster":"A group of customers with the same assigned centroid. The assignment step puts each customer into the cluster with the nearest centroid.","Centroid":"A position that gives the mean of each feature in a cluster. A centroid does not have to be a customer point.","Distance":"The straight-line distance between two positions. This example calculates Euclidean distance with the scaled features. If distances are equal, the first cluster letter has priority.","Mean":"The sum of the values divided by the number of values. Calculate the mean spending and the mean number of visits separately.","Scaling":"A change to the measurement scale of a feature. This example divides spending by $200 and visits by 20. A $10 difference and a one-visit difference have equal weight. Other scaling methods can give different results.","Iteration":"One assignment step followed by one centroid update step.","Convergence":"A condition in which further steps do not change the result. This example stops when assignments do not change after a centroid update.","Inertia":"The sum of squared distances from customers to their assigned centroids. This example uses scaled features. For the same data and K, a smaller value indicates smaller distances within clusters. Inertia alone cannot identify the best K.","PCA":"Principal component analysis. This method combines original features to create new axes that describe variation in the data. PCA is separate from k-means. This example does not use PCA."};
let k=3,seed=0,index=0,states=[],selected=-1;
const clone = x=>JSON.parse(JSON.stringify(x));
const sq=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
function build(){
 let randState=27+seed*101;
 const rand=()=>{randState=(Math.imul(1664525,randState)+1013904223)>>>0;return randState/4294967296;};
 const ids=data.map((_,i)=>i);for(let i=ids.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
 let centers=ids.slice(0,k).map(i=>({x:data[i].x,y:data[i].y}));
 states=[{type:'data',centers:[],labels:[],round:0},{type:'init',centers:clone(centers),labels:[],round:0}];
 let previous=[];
 for(let round=1;round<=100;round++){
  const labels=data.map(p=>centers.reduce((best,c,i)=>sq(p,c)<sq(p,centers[best])?i:best,0));
  const changed=labels.filter((c,i)=>c!==previous[i]).length;
  const cost=labels.reduce((sum,c,i)=>sum+sq(data[i],centers[c]),0);
  states.push({type:changed===0?'done':'assign',centers:clone(centers),labels:labels.slice(),round,changed,cost});
  if(!changed)break;
  const old=clone(centers);let empty=0;
  centers=centers.map((c,j)=>{const members=data.filter((_,i)=>labels[i]===j);if(!members.length){empty++;return c;}return {x:members.reduce((s,p)=>s+p.x,0)/members.length,y:members.reduce((s,p)=>s+p.y,0)/members.length};});
  states.push({type:'move',centers:clone(centers),old,labels:labels.slice(),round,empty,cost:labels.reduce((sum,c,i)=>sum+sq(data[i],centers[c]),0)});
  previous=labels;
 }
 index=0;
}
function stageOf(s){return s.type==='data'?0:s.type==='init'?1:s.type==='done'?5:s.round>1?4:s.type==='assign'?2:3;}
const stageNames=['Data','Centroids','Assign','Update','Repeat','Results'];
$('#stages').innerHTML=stageNames.map((s,i)=>`<button class="stage" data-stage="${i}"><span>${i+1}</span>${s}</button>`).join('');
$('#stages').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const stage=+b.dataset.stage;let target=states.findIndex(s=>stageOf(s)===stage);if(target<0)target=states.length-1;index=target;render();});
$('#terms').innerHTML=Object.keys(glossary).map(t=>`<button class="word" data-term="${t}">${t}</button>`).join('');
document.querySelectorAll('[data-term]').forEach(el=>{const term=el.dataset.term;el.dataset.definition=glossary[term];el.setAttribute('aria-describedby','term-detail');const show=()=>{$('#term-detail').textContent=term+' — '+glossary[term];};el.addEventListener('mouseenter',show);el.addEventListener('focus',show);el.addEventListener('click',()=>{show();if(el.classList.contains('term'))$('#term-detail').scrollIntoView({block:'nearest',behavior:'smooth'});});});
data.forEach(p=>{$('#customer').add(new Option(`Customer ${String(p.id).padStart(2,'0')}`,p.id-1));});
$('#customer').onchange=e=>{selected=+e.target.value;draw();inspect();};
$('#k').onchange=e=>{k=+e.target.value;build();render();};
$('#restart').onclick=()=>{seed++;build();index=1;render();};
$('#back').onclick=()=>{if(index>0){index--;render();}};
$('#next').onclick=()=>{if(index<states.length-1){index++;render();}};
$('#links').onchange=draw;
function render(){
 const s=states[index];document.querySelectorAll('.stage').forEach((b,i)=>{b.classList.toggle('active',i===stageOf(s));b.setAttribute('aria-current',i===stageOf(s)?'step':'false');});
 $('#step-count').textContent=`STEP ${index+1} OF ${states.length}${s.round?' / ROUND '+s.round:''}`;
 const lessons={
 data:['Examine the customer data.','The data contains 30 customers. Each point shows monthly spending and the number of visits for one customer. All values refer to the same month.','The data does not include cluster labels. K-means calculates the clusters from the two features.'],
 init:[`Select ${k} starting centroids.`,`The program selected ${k} customer points at random. Each large cross shows a starting centroid. A letter identifies each centroid.`,'Different starting centroids can give different results. Select “Change starting centroids” to repeat the calculation with a different start.'],
 assign:['Assign customers to centroids.',s.round===1?'The program calculated the distance from each customer to each centroid. It assigned each customer to the nearest centroid.':`The program calculated the distances again. It changed the cluster assignment for ${s.changed} of 30 customers.`,'The customer points do not move. Their colors and shapes show their cluster assignments. The lines connect customers to their assigned centroids.'],
 move:['Update the centroids.',`The program calculated mean spending and mean visits for each cluster. It moved each centroid to these mean values. The dashed lines show the movement.${s.empty?' An empty cluster keeps its previous centroid position.':''}`,'The assignments stay the same during this step. The next assignment step uses the new centroid positions.'],
 done:['The assignments do not change.',`The program checked the assignments again. No customer changed clusters. Each centroid is at the mean of its cluster. The calculation is complete for K = ${k}.`,'These clusters show similar spending and visit values. They do not explain why customers behave this way.']
 };
 const l=lessons[s.type];$('#lesson').innerHTML=`<h3>${l[0]}</h3><p>${l[1]}</p><p class="why">${l[2]}</p>`;
 $('#back').disabled=index===0;$('#next').disabled=index===states.length-1;
 const next=states[index+1];$('#next').textContent=!next?'Complete ✓':next.type==='init'?'Select centroids →':next.type==='move'?'Update centroids →':next.type==='done'?'Check assignments →':s.type==='move'?'Assign again →':'Assign customers →';
 $('#inertia').textContent=s.cost===undefined?'—':s.cost.toFixed(3);
 const initial=states.find(x=>x.cost!==undefined).cost;$('#meter').style.width=s.cost===undefined?'0%':`${Math.min(100,s.cost/initial*100)}%`;
 $('#objective-note').textContent=s.cost===undefined?'K-means decreases the sum of squared distances.':`Scaled units² · ${Math.round((1-s.cost/initial)*100)}% lower than the first assignment.`;
 $('#legend').innerHTML=s.labels.length?Array.from({length:k},(_,i)=>`<span><i class="swatch" style="background:${colors[i]};${i===0?'border-radius:50%':i===2?'clip-path:polygon(50% 0,100% 100%,0 100%)':i===3?'transform:rotate(45deg)':''}"></i>${String.fromCharCode(65+i)} · ${s.labels.filter(c=>c===i).length}</span>`).join(''):'<span>● Unassigned customers</span>';
 $('#takeaways').hidden=s.type!=='done';
 if(s.type==='done'){$('#takeaways').innerHTML='<strong>Possible actions for the café</strong><div class="segments">'+s.centers.map((c,j)=>{let label,idea;if(c.y>.5){label='More visits';idea='Consider a reward after a specified number of visits.';}else if(c.x>.5){label='More spending, fewer visits';idea='Consider a discount on the next visit.';}else{label='Less spending, fewer visits';idea='Consider an offer for a second visit.';}return `<article class="segment" style="border-color:${colors[j]}"><h3>${String.fromCharCode(65+j)} · ${label}</h3><p>${s.labels.filter(v=>v===j).length} customers · mean $${(c.x*200).toFixed(0)} / month · ${(c.y*20).toFixed(1)} visits</p><p>${idea}</p></article>`;}).join('')+'</div><p class="note">These actions are suggestions. Measure the results before you use an offer for all customers.</p>';}
 draw();inspect();
}
function inspect(){const s=states[index],p=data[selected];if(!p){$('#customer-detail').textContent='Select a customer to compare the distances to all centroids.';return;}let text=`<strong>Customer ${String(p.id).padStart(2,'0')}</strong> · $${p.spend} spent · ${p.visits} visits this month.`;if(s.centers.length){const ds=s.centers.map(c=>Math.sqrt(sq(p,c)));text+='<div class="distances">'+ds.map((d,j)=>`<span class="distance ${s.labels[selected]===j?'chosen':''}">${String.fromCharCode(65+j)}: ${d.toFixed(3)}${s.labels[selected]===j?' · assigned':''}</span>`).join('')+'</div><small>Euclidean distances in scaled units.'+(s.type==='move'?' These are the previous assignments. Select “Assign again” to update them.':'')+'</small>';}else text+=' The program has not assigned clusters.';$('#customer-detail').innerHTML=text;}
function draw(){
 $('#axis-callout').hidden=true;
 const s=states[index],svg=$('#plot'),width=$('#plot-wrap').clientWidth;const left=74,right=28,top=32,bottom=72,side=Math.max(150,Math.min(500,width-left-right)),height=side+top+bottom;
 const origin=left+(width-left-right-side)/2,X=v=>origin+v*side,Y=v=>top+(1-v)*side;
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.style.height=height+'px';
 let html='<title>Café customer clusters</title><desc>Horizontal axis: monthly spending in dollars. Vertical axis: visits per month. Small marks show customers. Large crosses show centroids. Select a customer to read the values.</desc>';
 html+=`<rect x="${origin}" y="${top}" width="${side}" height="${side}" fill="#fff" stroke="#d7e3ed"/>`;
 const ticks=width<400?[0,.5,1]:[0,.25,.5,.75,1];ticks.forEach(t=>{html+=`<line x1="${X(t)}" x2="${X(t)}" y1="${top+side}" y2="${top+side+5}" stroke="#a5bbce"/><text x="${X(t)}" y="${top+side+29}" text-anchor="middle">$${t*200}</text><line x1="${origin-5}" x2="${origin}" y1="${Y(t)}" y2="${Y(t)}" stroke="#a5bbce"/><text x="${origin-10}" y="${Y(t)+6}" text-anchor="end">${t*20}</text>`;});
 html+=`<text class="axis-title axis-help" role="button" tabindex="0" data-axis="x" aria-controls="axis-callout" aria-expanded="false" aria-label="Monthly spending: explain this feature" x="${origin+side/2}" y="${height-8}" text-anchor="middle">Monthly spending ($) ⓘ</text><text class="axis-title axis-help" role="button" tabindex="0" data-axis="y" aria-controls="axis-callout" aria-expanded="false" aria-label="Visits per month: explain this feature" transform="translate(21 ${top+side/2}) rotate(-90)" text-anchor="middle">Visits per month ⓘ</text>`;
 if($('#links').checked&&s.labels.length)data.forEach((p,i)=>{const c=s.centers[s.labels[i]];html+=`<line x1="${X(p.x)}" y1="${Y(p.y)}" x2="${X(c.x)}" y2="${Y(c.y)}" stroke="${colors[s.labels[i]]}" opacity="${selected===i?.9:.17}" stroke-width="${selected===i?2:1}"/>`;});
 if(s.old)s.centers.forEach((c,j)=>{const o=s.old[j];html+=`<line x1="${X(o.x)}" y1="${Y(o.y)}" x2="${X(c.x)}" y2="${Y(c.y)}" stroke="${colors[j]}" stroke-dasharray="4 3" stroke-width="2"/><circle cx="${X(o.x)}" cy="${Y(o.y)}" r="9" stroke="${colors[j]}" opacity=".35" fill="none"/>`;});
 data.forEach((p,i)=>{const x=X(p.x),y=Y(p.y),group=s.labels[i],fill=group===undefined?'#8ba4ba':colors[group];if(selected===i)html+=`<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#102f52" stroke-width="2"/>`;const common=`fill="${fill}" stroke="#fff" stroke-width="1.3"`;html+=group===1?`<rect x="${x-6}" y="${y-6}" width="12" height="12" ${common}/>`:group===2?`<path d="M${x},${y-6} l6,11 h-12Z" ${common}/>`:group===3?`<path d="M${x},${y-6} l6,6 -6,6 -6,-6Z" ${common}/>`:`<circle cx="${x}" cy="${y}" r="6.5" ${common}/>`;});
 svg.innerHTML=html;
 document.querySelectorAll('.axis-help').forEach(label=>{
  const open=()=>{
   $('#axis-example').textContent=label.dataset.axis==='x'?'X-axis: one variable — total monthly spending.':'Y-axis: one variable — number of visits per month.';
   $('#axis-callout').hidden=false;
   document.querySelectorAll('.axis-help').forEach(el=>el.setAttribute('aria-expanded',String(el===label)));
  };
  label.onmouseenter=open;
  label.onfocus=open;
  label.onclick=e=>{e.stopPropagation();open();};
  label.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}if(e.key==='Escape')closeAxisCallout();};
 });
 s.centers.forEach((c,j)=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','centroid');g.innerHTML=`<path d="M-10,0 H10 M0,-10 V10" stroke="#fff" stroke-width="8"/><path d="M-10,0 H10 M0,-10 V10" stroke="${colors[j]}" stroke-width="4"/><text x="15" y="-14" style="font-weight:700;paint-order:stroke;stroke:#fff;stroke-width:3px">${String.fromCharCode(65+j)}</text>`;const old=s.old?s.old[j]:c;g.style.transform=`translate(${X(old.x)}px,${Y(old.y)}px)`;svg.appendChild(g);if(s.old&&!matchMedia('(prefers-reduced-motion: reduce)').matches){requestAnimationFrame(()=>requestAnimationFrame(()=>g.style.transform=`translate(${X(c.x)}px,${Y(c.y)}px)`));}else g.style.transform=`translate(${X(c.x)}px,${Y(c.y)}px)`;});
 svg.onclick=e=>{const r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let best=-1,d=22;data.forEach((p,i)=>{const dist=Math.hypot(X(p.x)-mx,Y(p.y)-my);if(dist<d){d=dist;best=i;}});if(best>=0){selected=best;$('#customer').value=selected;draw();inspect();}};
}
function closeAxisCallout(){
 $('#axis-callout').hidden=true;
 document.querySelectorAll('.axis-help').forEach(el=>el.setAttribute('aria-expanded','false'));
}
$('#axis-close').onclick=closeAxisCallout;
$('#axis-callout').onkeydown=e=>{if(e.key==='Escape')closeAxisCallout();};
build();render();new ResizeObserver(draw).observe($('#plot-wrap'));
window.clusterDemo={data,get states(){return states;},get index(){return index;},setK(n){k=n;$('#k').value=n;build();render();},setSeed(n){seed=n;build();render();}};
})();
