const fs=require('fs');
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace(/<header class="mast">[\s\S]*?<\/header>/,'');
html=html.replace(/<section class="slide-notes"[\s\S]*?<\/section>/,'');
html=html.replace('EXAMPLE: CAFÉ CUSTOMERS','CUSTOMER ANALYTICS · FICTIONAL CAFÉ');
html=html.replace('Use k-means to<br><em>group customers.</em>','K-means for<br><em>café customers</em>');
html=html.replace('A café records how much each customer spends and how often each customer visits. <strong>K-means clustering</strong> puts customers with similar values into groups. Each group is a cluster.','Campus Café records each customer’s monthly spending and number of visits. Use <strong>k-means clustering</strong> to put customers with similar values into groups.<br><strong>30 customers · 2 features · 1 month</strong>');
html=html.replace(/<div class="receipt">[\s\S]*?<\/small><\/div>/,'<figure class="cafe-photo"><img src="campus-cafe.png" alt="The fictional Campus Café, with a blue awning and students at outdoor tables." width="1536" height="1024"><figcaption>Campus Café · Fictional business and example data</figcaption></figure>');
html=html.replace('id="lab-title">Examine each step','id="lab-title">Group the café customers');
html=html.replace('<footer>K-MEANS CLUSTERING <span>Select centroids → assign customers → update centroids → repeat.</span></footer>','');
html=html.replace('href="style.css"','href="style.css?v=3"').replace('src="app.js"','src="app.js?v=3"');
fs.writeFileSync('dist/index.html',html);
let js=fs.readFileSync('dist/app.js','utf8');
js=js.replace('const left=57,right=17,top=24,bottom=49,side=Math.max(180,Math.min(420,width-left-right))','const left=74,right=28,top=32,bottom=72,side=Math.max(150,Math.min(500,width-left-right))');
js=js.replace('top+side+21','top+side+29').replace('Y(t)+4','Y(t)+6').replace('translate(15 ${top+side/2})','translate(21 ${top+side/2})').replace('height-4','height-8');
js=js.replace('x="12" y="-11"','x="15" y="-14"');
// Retain all calculations. Increase only the visual size of customer marks.
js=js.replace('r="5"','r="6.5"').replace('x-4.8','x-6').replace('y-4.8','y-6').replace('width="9.6" height="9.6"','width="12" height="12"');
fs.writeFileSync('dist/app.js',js);
