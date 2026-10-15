/* Evidence-led Food Truths learning cards; these are general rules, not product allegations. */
(function(){
'use strict';
const cards=[
{market:'us',title:'Total sugar and added sugar are different',body:'Total sugar includes naturally occurring sugars and added sugars. The US Nutrition Facts label separately identifies added sugar.',action:'Check the Added Sugars line, not only Total Sugars.',source:'US FDA',url:'https://www.fda.gov/food/nutrition-facts-label/added-sugars-nutrition-facts-label'},
{market:'us',title:'A serving size is not a recommended portion',body:'The serving size on a US label reflects reference amounts people typically consume. It is not a recommendation for how much a child should eat.',action:'Compare the amount your child actually eats with the stated serving.',source:'US FDA',url:'https://www.fda.gov/food/nutrition-facts-label/whats-nutrition-facts-label'},
{market:'us',title:'Understand the percent Daily Value',body:'The percent Daily Value indicates a nutrient’s contribution to general daily reference values; it is not a personalised child-specific target.',action:'Use the value for context and consult age-appropriate guidance.',source:'US FDA',url:'https://www.fda.gov/food/new-nutrition-facts-label/lows-and-highs-percent-daily-value-new-nutrition-facts-label'},
{market:'in',title:'Check the current Indian labelling rules',body:'India regulates packaged-food labelling under FSSAI Labelling and Display Regulations. Requirements and amendments can change.',action:'Check the current label and FSSAI regulations before relying on marketing claims.',source:'FSSAI',url:'https://www.fssai.gov.in/food-law/regulations/amendments/labelling-display'},
{market:'both',title:'Compare like with like',body:'A packet showing values per serving may not be directly comparable with another showing per 100 g. Product formulations can differ between India and the US.',action:'Standardise by weight and check the specific country formulation.',source:'US FDA / FSSAI',url:'https://www.fda.gov/food/nutrition-education-resources-materials/nutrition-facts-label'}
];
function mount(){
 const host=document.querySelector('#ft-items');if(!host||document.querySelector('#ft-education-bank'))return;
 const box=document.createElement('section');box.id='ft-education-bank';
 const heading=document.createElement('h2');heading.textContent='You should know: label-reading essentials';box.append(heading);
 const note=document.createElement('p');note.textContent='Source-linked guidance for parents. These are general educational notes, not allegations about any particular brand.';box.append(note);
 const grid=document.createElement('div');grid.className='ft-education-grid';box.append(grid);
 for(const item of cards){
  const article=document.createElement('article');article.dataset.market=item.market;
  const title=document.createElement('h3');title.textContent=item.title;article.append(title);
  const body=document.createElement('p');body.textContent=item.body;article.append(body);
  const action=document.createElement('p');action.className='ft-education-action';action.textContent='What to do: '+item.action;article.append(action);
  const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Read '+item.source+' guidance ↗';article.append(link);grid.append(article);
 }
 host.parentElement.insertAdjacentElement('afterend',box);
 function filter(){const active=document.querySelector('.ft-switch button.on')?.dataset.country||'both';grid.querySelectorAll('article').forEach(a=>a.hidden=active!=='both'&&a.dataset.market!=='both'&&a.dataset.market!==active)}
 filter();document.querySelectorAll('.ft-switch button').forEach(b=>b.addEventListener('click',filter));
}
function init(){const main=document.querySelector('#main');if(!main)return;new MutationObserver(()=>{if(location.hash.startsWith('#/food-truth'))mount()}).observe(main,{childList:true,subtree:true});mount()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();