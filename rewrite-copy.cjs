const fs = require('fs');
const replaceAll = (source, pairs) => { for (const [from,to] of pairs) { if (!source.includes(from)) throw new Error('Missing copy: '+from); source=source.split(from).join(to); } return source; };
let html=fs.readFileSync('dist/index.html','utf8');
html=replaceAll(html,[
['Café Clusters · K-means in motion','K-means clustering · Café customers'],
['Discover k-means by grouping café customers, one assignment and centroid move at a time.','Use k-means to put café customers into clusters. Examine each assignment and centroid update.'],
['THE CUSTOMER LAB','K-MEANS CLUSTERING'],['Fix the slides','Slide corrections'],
['A SMALL CAFÉ. A BIG DATA IDEA.','EXAMPLE: CAFÉ CUSTOMERS'],
['Find the pattern.<br><em>Meet your customers.</em>','Use k-means to<br><em>group customers.</em>'],
['Who drops in occasionally? Who makes you part of their routine? Use <strong>k-means clustering</strong> to find groups of customers with similar spending and visiting habits.','A café records how much each customer spends and how often each customer visits. <strong>K-means clustering</strong> puts customers with similar values into groups. Each group is a cluster.'],
['Illustrative data.<br>A real business question.','Example data.<br>Not actual customer records.'],
['YOUR CLUSTERING WORKBENCH','PROCEDURE'],['One move at a time.','Examine each step'],
['Try another start ↻','Change starting centroids ↻'],['Explore the algorithm','Algorithm steps'],
['Café customer spending and visits, with cluster centers','Customer spending, visits, and centroids'],
['<strong>Fair comparison:</strong> spending ÷ $200; visits ÷ 20. In this model, $10 and 1 visit count equally toward distance. Axes retain the original units.','<strong>Feature scaling:</strong> The calculation divides spending by $200 and visits by 20. A $10 difference and a one-visit difference have equal weight. The axes show the original units.'],
['Within-cluster squared distance','Inertia'],['The goal: smaller distances within each group.','K-means decreases the sum of squared distances.'],
['Move forward one step, or jump with the numbered stages.','Select the next step. To go directly to a stage, select its number.'],
['Follow a customer','Select a customer'],['Choose a customer…','Select a customer…'],
['Select a customer to compare their distance to every centroid.','Select a customer to compare the distances to all centroids.'],
['THE JARGON, TRANSLATED','TECHNICAL TERMS'],
['Hover, focus, or tap a term for a plain-language explanation.','Select a term to see its definition. You can also put the pointer on the term.'],
['TEACHER’S NOTES','SLIDE CORRECTIONS'],['One important correction.<br>A few useful refinements.','Separate k-means from PCA'],
['<strong>K-means does not select principal components.</strong> PCA is a separate, optional preprocessing method. PCA creates new axes that are weighted combinations of the original features and capture variance—not necessarily business importance. If your axes directly show spending and visits, call them <strong>features</strong>, not principal components.','<strong>K-means does not select principal components.</strong> Principal component analysis (PCA) is a separate method. PCA combines the original features to create new axes. These axes describe variation in the data. They do not necessarily identify the features most important to the business. If the axes show spending and visits directly, use the term <strong>features</strong>.'],
['SLIDE 01 · THE SETUP','SLIDE 01 · INPUT DATA'],['How does it work?','Prepare the data'],
['Each point represents one customer.','Each point shows one customer.'],
['X-axis (Feature 1): total customer spending in one month ($).','The x-axis shows Feature 1: total spending in one month ($).'],
['Y-axis (Feature 2): number of visits in the same month.','The y-axis shows Feature 2: number of visits in the same month.'],
['Scale the features so their units do not unintentionally dominate distance.','Scale the features before you calculate distances.'],
['Choose K, the number of clusters to form (K = 3 here).','Select K, the number of clusters. This example starts with K = 3.'],
['K-means groups customers by similarity using the features we provide.','K-means uses these features to put similar customers into clusters.'],
['Assign. Average. Repeat.','Calculate the clusters'],
['Initialize K centroids—for example, choose K customer points at random. K-means++ is a common alternative.','Select K starting centroids. For example, select K customer points at random.'],
['Assign each customer to the nearest centroid using Euclidean distance in the scaled feature space.','Calculate Euclidean distances with the scaled features. Assign each customer to the nearest centroid.'],
['Move each centroid to the mean of all customers assigned to its cluster.','Calculate the mean of each feature for each cluster. Move each centroid to these mean values.'],
['Repeat assignment and updating until assignments stabilize or centroid movement is sufficiently small (with an iteration limit).','Repeat the assignment and centroid update steps. Stop when assignments do not change or centroid movement is below a specified limit. Set a maximum number of iterations.'],
['K-means produces K groups; it does not prove that K naturally distinct customer types exist. Different starts can give different solutions. Compare several runs and values of K, and use business context, the elbow method, or silhouette scores to assess usefulness. Our demo uses fixed, reproducible random starts and stops at stable assignments.','K-means produces K clusters. These clusters do not prove that K separate customer types exist. Different starting centroids can give different results. K-means++ is an alternative method to select starting centroids. Compare results from different starts and values of K. Use business requirements to assess the results. This example stops when assignments do not change.'],
['Method reference:','References:'],['Observe → assign → average → repeat.','Select centroids → assign customers → update centroids → repeat.']
]);
fs.writeFileSync('dist/index.html',html);
let js=fs.readFileSync('dist/app.js','utf8');
const glossary={
 K:'The number of clusters. Select K before the calculation starts. K-means does not select K.',
 Feature:'A measured property of a customer. This example uses two features: monthly spending and number of visits.',
 Cluster:'A group of customers with the same assigned centroid. The assignment step puts each customer into the cluster with the nearest centroid.',
 Centroid:'A position that gives the mean of each feature in a cluster. A centroid does not have to be a customer point.',
 Distance:'The straight-line distance between two positions. This example calculates Euclidean distance with the scaled features. If distances are equal, the first cluster letter has priority.',
 Mean:'The sum of the values divided by the number of values. Calculate the mean spending and the mean number of visits separately.',
 Scaling:'A change to the measurement scale of a feature. This example divides spending by $200 and visits by 20. A $10 difference and a one-visit difference have equal weight. Other scaling methods can give different results.',
 Iteration:'One assignment step followed by one centroid update step.',
 Convergence:'A condition in which further steps do not change the result. This example stops when assignments do not change after a centroid update.',
 Inertia:'The sum of squared distances from customers to their assigned centroids. This example uses scaled features. For the same data and K, a smaller value indicates smaller distances within clusters. Inertia alone cannot identify the best K.',
 PCA:'Principal component analysis. This method combines original features to create new axes that describe variation in the data. PCA is separate from k-means. This example does not use PCA.'
};
js=js.replace(/const glossary=\{.*?\};/, 'const glossary='+JSON.stringify(glossary)+';');
const lessonStart=js.indexOf(' const lessons=');const lessonEnd=js.indexOf('\n const l=lessons',lessonStart);
js=js.slice(0,lessonStart)+` const lessons={
 data:['Examine the customer data.','The data contains 30 customers. Each point shows monthly spending and the number of visits for one customer. All values refer to the same month.','The data does not include cluster labels. K-means calculates the clusters from the two features.'],
 init:[\`Select \${k} starting centroids.\`,\`The program selected \${k} customer points at random. Each large cross shows a starting centroid. A letter identifies each centroid.\`,'Different starting centroids can give different results. Select “Change starting centroids” to repeat the calculation with a different start.'],
 assign:['Assign customers to centroids.',s.round===1?'The program calculated the distance from each customer to each centroid. It assigned each customer to the nearest centroid.':\`The program calculated the distances again. It changed the cluster assignment for \${s.changed} of 30 customers.\`,'The customer points do not move. Their colors and shapes show their cluster assignments. The lines connect customers to their assigned centroids.'],
 move:['Update the centroids.',\`The program calculated mean spending and mean visits for each cluster. It moved each centroid to these mean values. The dashed lines show the movement.\${s.empty?' An empty cluster keeps its previous centroid position.':''}\`,'The assignments stay the same during this step. The next assignment step uses the new centroid positions.'],
 done:['The assignments do not change.',\`The program checked the assignments again. No customer changed clusters. Each centroid is at the mean of its cluster. The calculation is complete for K = \${k}.\`,'These clusters show similar spending and visit values. They do not explain why customers behave this way.']
 };`+js.slice(lessonEnd);
js=replaceAll(js,[
 ["['Meet the data','Place centers','Assign','Move','Repeat','Interpret']","['Data','Centroids','Assign','Update','Repeat','Results']"],
 ['Select a customer to compare their distance to every centroid.','Select a customer to compare the distances to all centroids.'],
 ["'Converged ✓'","'Complete ✓'"],["'Place centroids →'","'Select centroids →'"],["'Move to means →'","'Update centroids →'"],["'Check stability →'","'Check assignments →'"],["'Reassign →'","'Assign again →'"],
 ['The goal: smaller distances within each group.','K-means decreases the sum of squared distances.'],
 ['From groups to business experiments','Possible actions for the café'],
 ["label='Frequent visitors';idea='Test a loyalty reward or coffee subscription.'","label='More visits';idea='Consider a reward after a specified number of visits.'"],
 ["label='Bigger-spend, fewer-visit customers';idea='Test a food bundle or a return-visit offer.'","label='More spending, fewer visits';idea='Consider a discount on the next visit.'"],
 ["label='Lighter, occasional visitors';idea='Test a small incentive for a second visit.'","label='Less spending, fewer visits';idea='Consider an offer for a second visit.'"],
 ['Suggested interpretations and experiments—not measured preferences or proven campaign results.','These actions are suggestions. Measure the results before you use an offer for all customers.'],
 [' Membership is still from the previous assignment; reassign next.',' These are the previous assignments. Select “Assign again” to update them.'],
 [' Clusters have not been assigned yet.',' The program has not assigned clusters.'],
 ['Small marks are customers; large crosses are centroids. Use the customer selector for accessible point details.','Small marks show customers. Large crosses show centroids. Select a customer to read the values.']
]);
fs.writeFileSync('dist/app.js',js);
