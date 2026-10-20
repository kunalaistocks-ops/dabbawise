/* User-confirmed USDA ingredient matching. Never auto-assign a search hit. */
(function(){
'use strict';
const CONFIG=window.__dwPublicConfig;if(!CONFIG||CONFIG.environment!=='staging')throw Error('Staging configuration required');const base=CONFIG.url,key=CONFIG.publishableKey;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let currentRow=null,matches=[];
const client=()=>window.__dwSupabaseClient||(window.__dwSupabaseClient=window.supabase.createClient(base,key));
function panel(){
 let el=document.getElementById('dw-usda-match');
 if(!el){el=document.createElement('div');el.id='dw-usda-match';el.innerHTML='<section class="dw-usda-match-modal" role="dialog" aria-modal="true" aria-labelledby="dw-usda-match-title"><button type="button" id="dw-usda-match-close" aria-label="Close">×</button><h2 id="dw-usda-match-title">Find the right ingredient</h2><p>Search USDA FoodData Central, then choose the matching raw or cooked food. Values are per 100 g; you must verify the match.</p><form id="dw-usda-match-form"><input id="dw-usda-match-query" maxlength="90" placeholder="e.g. cooked chickpeas" required><button type="submit">Search</button></form><div id="dw-usda-match-status" role="status"></div><div id="dw-usda-match-results"></div></section>';document.body.appendChild(el);el.querySelector('#dw-usda-match-close').onclick=()=>el.remove();el.onclick=e=>{if(e.target===el)el.remove()};el.querySelector('#dw-usda-match-form').onsubmit=search}
 return el;
}
async function search(e){
 e.preventDefault();const root=document.getElementById('dw-usda-match');const output=root.querySelector('#dw-usda-match-results'),status=root.querySelector('#dw-usda-match-status');const q=root.querySelector('#dw-usda-match-query').value.trim();output.replaceChildren();status.textContent='Searching USDA…';
 try{
  const {data:{session}}=await client().auth.getSession();
  if(!session)throw Error('Sign in to use the USDA lookup.');
  const r=await fetch(base+'/functions/v1/usda-food-search',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token,apikey:key},body:JSON.stringify({query:q})});
  const data=await r.json();if(!r.ok)throw Error(data.error||'Search unavailable');
  matches=(data.foods||[]).filter(x=>Number.isFinite(x.nutrients?.energy_kcal));
  status.textContent=matches.length?matches.length+' matches. Confirm the exact ingredient and preparation state.':'No matching USDA records with calories. Try another term.';
  output.innerHTML=matches.map((f,i)=>'<article class="dw-usda-hit"><b>'+esc(f.name)+'</b><small>'+esc(f.dataType||'USDA')+' · '+esc(f.fdcId)+'</small><p>'+Number(f.nutrients.energy_kcal).toFixed(1)+' kcal / 100 g · Protein: '+(Number.isFinite(f.nutrients.protein_g)?f.nutrients.protein_g+' g':'not reported')+' · Fibre: '+(Number.isFinite(f.nutrients.fiber_g)?f.nutrients.fiber_g+' g':'not reported')+'</p><button type="button" data-hit="'+i+'">Use this food</button></article>').join('');
  output.querySelectorAll('[data-hit]').forEach(b=>b.onclick=()=>choose(matches[Number(b.dataset.hit)]));
 }catch(err){status.textContent=err.message||'USDA lookup unavailable'}
}
function choose(food){
 if(!currentRow)return;
 const n=food.nutrients;
 currentRow.querySelector('[name="kcal"]').value=n.energy_kcal;
 currentRow.querySelector('[name="protein"]').value=Number.isFinite(n.protein_g)?n.protein_g:'';
 currentRow.querySelector('[name="fiber"]').value=Number.isFinite(n.fiber_g)?n.fiber_g:'';
 currentRow.dataset.fdc=String(food.fdcId);
 currentRow.dataset.source='USDA FoodData Central #'+food.fdcId+' (parent-selected)';
 const source=currentRow.querySelector('.dw-calc-source');if(source)source.textContent=currentRow.dataset.source;
 document.getElementById('dw-usda-match')?.remove();
}
function init(){
 document.addEventListener('click',e=>{
  const b=e.target.closest('.dw-calc-lookup');if(!b)return;
  currentRow=b.closest('.dw-calc-row');if(!currentRow)return;
  const label=currentRow.querySelector('.dw-calc-ingredient')?.firstChild?.textContent||'';
  const root=panel();root.querySelector('#dw-usda-match-query').value=label.replace(/\b\d+(?:\/\d+)?\s*(?:cup|tbsp|tsp|g|oz|ml|pieces?)\b/gi,'').trim().slice(0,90);
  root.querySelector('#dw-usda-match-query').focus();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();