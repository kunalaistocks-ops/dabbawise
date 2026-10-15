/* Manual recipe nutrition worksheet: parent-supplied data only, no fabricated nutrient values. */
(function(){
'use strict';
const PREFIX='dw2_recipe_nutrition_';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const stored=id=>{try{return JSON.parse(localStorage.getItem(PREFIX+id)||'null')}catch{return null}};
function summary(id){
 const x=stored(id);if(!x||!x.complete)return '<span class="dw-calc-missing">Calories: calculation needed</span>';
 return '<span class="dw-calc-ready">≈ '+Math.round(x.perServing.kcal)+' kcal per serving · Parent-entered estimate</span>';
}
function addToRecipe(id,markup){
 const recipe=typeof getR==='function'?getR(id):null;if(!recipe)return markup;
 const idEncoded=encodeURIComponent(id);
 const content='<section class="dw-calc-intro"><div><b>⚡ Calories & nutrition</b><p>'+summary(id)+'</p><small>Enter ingredient weights and verified per-100 g nutrition values to calculate an estimate. No values are guessed.</small></div><button type="button" onclick="window.dwOpenRecipeNutrition(decodeURIComponent(\''+idEncoded+'\'))">Calculate this recipe →</button></section>';
 return markup+content;
}
function open(id){
 const recipe=typeof getR==='function'?getR(id):null;if(!recipe)return;
 document.getElementById('dw-calc-overlay')?.remove();
 const ing=Array.isArray(recipe.ing)?recipe.ing:[];
 const prior=stored(id),priorRows=prior?.rows||[];
 const row=(label,i)=>{
  const old=priorRows[i]||{};
  return '<div class="dw-calc-row" data-fdc="'+esc(old.fdcId||'')+'" data-source="'+esc(old.source||'')+'"><div class="dw-calc-ingredient">'+esc(label)+'<button type="button" class="dw-calc-lookup">🔎 Find USDA match</button><small class="dw-calc-source">'+esc(old.source||'')+'</small></div><label>Ingredient weight (g)<input type="number" min="0" max="20000" step="any" name="weight" value="'+esc(old.weight??'')+'" placeholder="e.g. 75"></label><label>Calories / 100 g<input type="number" min="0" max="1000" step="any" name="kcal" value="'+esc(old.kcal??'')+'" placeholder="From label or USDA"></label><label>Protein / 100 g (optional)<input type="number" min="0" max="100" step="any" name="protein" value="'+esc(old.protein??'')+'"></label><label>Fibre / 100 g (optional)<input type="number" min="0" max="100" step="any" name="fiber" value="'+esc(old.fiber??'')+'"></label></div>';
 };
 const div=document.createElement('div');div.id='dw-calc-overlay';
 div.innerHTML='<section class="dw-calc-modal" role="dialog" aria-modal="true" aria-labelledby="dw-calc-title"><button type="button" class="dw-calc-close" aria-label="Close">×</button><div class="dw-calc-eyebrow">RECIPE NUTRITION WORKSHEET</div><h2 id="dw-calc-title">'+esc(recipe.name)+'</h2><p>These values are <b>entered by you</b>, not verified by Dabbawise. Use the nutrition label or <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer">USDA FoodData Central ↗</a> for per-100 g values. Measure ingredient weights. Include cooking oils, sauces and other caloric ingredients.</p><label class="dw-calc-servings">Recipe servings<input id="dw-calc-servings" type="number" min="1" max="50" step="1" value="'+esc(prior?.servings||recipe.serves||2)+'"></label><div id="dw-calc-rows">'+ing.map(row).join('')+'</div><div class="dw-calc-actions"><button type="button" id="dw-calc-add">+ Add ingredient</button><button type="button" id="dw-calc-compute">Calculate & save locally</button></div><div id="dw-calc-result" role="status"></div><p class="dw-calc-foot">Estimates do not account for cooking losses, changes in water weight, ingredient substitutions or allergens. Nutrient fields left blank remain unreported. Not a personalised dietary recommendation.</p></section>';
 document.body.appendChild(div);
 div.querySelector('.dw-calc-close').onclick=()=>div.remove();
 div.onclick=e=>{if(e.target===div)div.remove()};
 div.querySelector('#dw-calc-add').onclick=()=>{const i=div.querySelectorAll('.dw-calc-row').length;div.querySelector('#dw-calc-rows').insertAdjacentHTML('beforeend',row('Additional ingredient '+(i+1),i))};
 div.querySelector('#dw-calc-compute').onclick=()=>compute(id,div);
}
function compute(id,div){
 const servings=Number(div.querySelector('#dw-calc-servings').value);
 const result=div.querySelector('#dw-calc-result');
 if(!Number.isInteger(servings)||servings<1||servings>50){result.textContent='Enter a valid number of servings (1–50).';return}
 const rows=[...div.querySelectorAll('.dw-calc-row')].map(el=>{const get=n=>el.querySelector('[name="'+n+'"]').value;return {ingredient:el.querySelector('.dw-calc-ingredient').textContent,weight:get('weight'),kcal:get('kcal'),protein:get('protein'),fiber:get('fiber'),fdcId:el.dataset.fdc||null,source:el.dataset.source||null}});
 if(!rows.length||rows.some(r=>r.weight===''||r.kcal===''||Number(r.weight)<=0||Number(r.kcal)<0||Number(r.weight)>20000||Number(r.kcal)>1000)){result.textContent='Enter a positive gram weight and a valid calorie value per 100 g for every ingredient. No estimate was saved.';return}
 const hasProtein=rows.every(r=>r.protein!==''&&Number(r.protein)>=0&&Number(r.protein)<=100);
 const hasFiber=rows.every(r=>r.fiber!==''&&Number(r.fiber)>=0&&Number(r.fiber)<=100);
 const total={kcal:0,protein:hasProtein?0:null,fiber:hasFiber?0:null};
 for(const r of rows){total.kcal+=Number(r.weight)*Number(r.kcal)/100;if(hasProtein)total.protein+=Number(r.weight)*Number(r.protein)/100;if(hasFiber)total.fiber+=Number(r.weight)*Number(r.fiber)/100}
 const perServing={kcal:total.kcal/servings,protein:hasProtein?total.protein/servings:null,fiber:hasFiber?total.fiber/servings:null};
 localStorage.setItem(PREFIX+id,JSON.stringify({complete:true,source:'parent-entered label or food-composition values (unverified)',basis:'per serving',servings,rows,total,perServing,updatedAt:new Date().toISOString()}));
 result.innerHTML='<strong>Estimated per serving: '+Math.round(perServing.kcal)+' kcal</strong><p>Protein: '+(hasProtein?perServing.protein.toFixed(1)+' g':'not calculated')+' · Fibre: '+(hasFiber?perServing.fiber.toFixed(1)+' g':'not calculated')+'</p><p>Saved locally in this browser. Reopen the recipe to see the updated estimate.</p>';
}
function init(){
 if(typeof V!=='undefined'&&typeof V.r==='function'){
  const original=V.r;
  V.r=function(id){return addToRecipe(id,original(id))};
 }
 window.dwOpenRecipeNutrition=open;
 const old=window.dwNutriPlanBadge;
 window.dwNutriPlanBadge=function(recipe){const value=stored(recipe.id);if(value?.complete)return '<span class="dw-nutri-chip">≈ '+Math.round(value.perServing.kcal)+' kcal / serving · user estimate</span>';return typeof old==='function'?old(recipe):'<span class="dw-nutri-chip">Calories: not calculated</span>'};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();