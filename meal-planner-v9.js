/* Meal planning V9: parent-led, cuisine-aware, deterministic and editable. */
(function(){
'use strict';
const PREF_KEY='dw2_meal_preferences';
const read=()=>{try{return JSON.parse(localStorage.getItem(PREF_KEY)||'{}')||{}}catch{return {}}};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories=['breakfast','lunchbox','snack','dinner'];
function openPlanner(){
 document.getElementById('dw-plan-overlay')?.remove();
 const p=read();
 const wrap=document.createElement('div');wrap.id='dw-plan-overlay';
 wrap.innerHTML='<section class="dw-plan-dialog" role="dialog" aria-modal="true" aria-labelledby="dw-plan-title"><button class="dw-plan-close" aria-label="Close">×</button><div class="dw-plan-kicker">YOUR FAMILY · YOUR FOOD</div><h2 id="dw-plan-title">Build your week in seconds</h2><p>Choose what your family enjoys. We’ll suggest a week of recipes that you can swap, edit and add to your shopping list.</p><form id="dw-plan-form"><div class="dw-plan-fields"><label>Food style<select name="cuisine"><option value="western">Western / American</option><option value="indian">Indian</option><option value="mixed">Mix of both</option></select></label><label>Diet<select name="diet"><option value="family">Use family preferences</option><option value="veg">Vegetarian</option><option value="egg">Vegetarian + eggs</option><option value="nonveg">Includes meat and fish</option></select></label><label>Cooking time<select name="minutes"><option value="15">Up to 15 minutes</option><option value="30">Up to 30 minutes</option><option value="45">Up to 45 minutes</option><option value="90">Any cooking time</option></select></label><label>Plan length<select name="days"><option value="3">3 days</option><option value="5">5 days</option><option value="7">7 days</option></select></label><label>Focus<select name="focus"><option value="variety">Balanced variety</option><option value="quick">Quick and practical</option><option value="familiar">Familiar favourites</option></select></label><label>Meals<select name="meals"><option value="all">All four meal occasions</option><option value="lunchbox">School lunchbox / dabba</option><option value="dinner">Dinner only</option><option value="breakfast">Breakfast only</option></select></label></div><label>Ingredients to avoid (optional)<input name="avoid" placeholder="e.g. mushroom, spinach" maxlength="180"></label><label class="dw-plan-check"><input type="checkbox" name="replace" checked> Replace the current plan</label><div class="dw-plan-safety">Recipe screening is approximate, not an allergy-safe certification. Check ingredients, substitutions, labels and cross-contact yourself. No nutritional targets are calculated in this beta.</div><div class="dw-plan-actions"><button type="button" class="dw-plan-cancel">Cancel</button><button type="submit" class="dw-plan-submit">✨ Generate my meal plan</button></div><p id="dw-plan-feedback" role="status" aria-live="polite"></p></form></section>';
 document.body.appendChild(wrap);
 wrap.querySelector('.dw-plan-close').onclick=()=>wrap.remove();
 wrap.querySelector('.dw-plan-cancel').onclick=()=>wrap.remove();
 wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
 const form=wrap.querySelector('form');
 for(const [k,v] of Object.entries(p)){if(form.elements[k]&&k!=='replace')form.elements[k].value=v}
 form.onsubmit=e=>{e.preventDefault();generate(form,wrap)};
}
function generate(form,wrap){
 const d=Object.fromEntries(new FormData(form).entries());d.replace=form.elements.replace.checked;
 const target=d.cuisine==='western'?'us':d.cuisine==='indian'?'in':null;
 const avoid=d.avoid.toLowerCase().split(/[,;]+/).map(x=>x.trim()).filter(Boolean);
 const family=typeof kids==='function'?kids():[];
 const recipes=(typeof RECIPES!=='undefined'?RECIPES:[]);
 const slots=d.meals==='all'?categories:[d.meals];
 const pools={};
 for(const slot of slots){
  pools[slot]=recipes.filter(r=>(!target||r.r===target)&&r.type===slot&&r.mins<=Number(d.minutes)
    &&(d.diet==='family'?fitFamily(r).ok:dietOK(r,d.diet))
    &&!avoid.some(x=>(r.ing||[]).join(' ').toLowerCase().includes(x))
    &&!family.some(k=>(k.allergies||[]).some(a=>recAllergens(r).includes(a))));
  if(!pools[slot].length){wrap.querySelector('#dw-plan-feedback').textContent='Not enough '+slot+' recipes match. Try a longer cooking time, mixed cuisine, or fewer exclusions.';return}
 }
 const key='dw2_plan_'+(typeof REG==='function'?REG():'in');
 let previous={};try{previous=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
 const next=d.replace?{}:structuredClone(previous);
 const usage={};let added=0;
 for(let i=0;i<Number(d.days);i++){
  const day=DAYS[i];next[day]=next[day]||[];
  for(const slot of slots){
   const candidates=pools[slot].slice().sort((a,b)=>{
    const score=r=>(usage[r.id]||0)*20+(d.focus==='quick'?r.mins:0)+(d.focus==='familiar'?Math.max(0,r.mins-20):0);
    return score(a)-score(b)||a.name.localeCompare(b.name);
   });
   const r=candidates[(i+categories.indexOf(slot))%Math.min(candidates.length,Math.max(1,Math.ceil(candidates.length/2)))];
   if(!next[day].includes(r.id)){next[day].push(r.id);added++}
   usage[r.id]=(usage[r.id]||0)+1;
  }
 }
 if(!added){wrap.querySelector('#dw-plan-feedback').textContent='Your selected meals are already in this plan. Choose Replace to generate again.';return}
 localStorage.setItem(key,JSON.stringify(next));
 localStorage.setItem(PREF_KEY,JSON.stringify({cuisine:d.cuisine,diet:d.diet,minutes:d.minutes,days:d.days,focus:d.focus,meals:d.meals,avoid:d.avoid}));
 wrap.remove();
 if(typeof toast==='function')toast('Generated '+added+' meal ideas. Review and edit your week.');
 if(typeof render==='function')render();
}
function decorate(){
 if(typeof V==='undefined'||!V.week||V.week.__dwPlanV9)return;
 const original=V.week;
 V.week=function(...args){let h=original(...args);
 const panel='<section class="dw-planner-hero"><div><span class="dw-plan-kicker">MEAL PLANNER</span><h2>A whole week, made easier.</h2><p>Western, Indian or a mix. Choose your preferences and get an editable meal plan in seconds.</p><button class="dw-plan-main" onclick="window.dwOpenMealPlanner()">✨ Generate my weekly meal plan →</button></div><div class="dw-plan-emoji" aria-hidden="true">🥗</div></section>';
 h=h.replace(/<div class="row between"><h1>My Week<\/h1>/,'<div class="row between"><h1>My Week</h1>');
 return panel+h.replace(/onclick="autoWeek\(\)"/g,'onclick="window.dwOpenMealPlanner()"').replace(/>Auto-plan</g,'>Plan with preferences</');
 };
 V.week.__dwPlanV9=true;
}
window.dwOpenMealPlanner=openPlanner;
function init(){decorate();const nav=document.querySelector('.sidex');if(nav&&!nav.querySelector('.dw-plan-nav')){const a=document.createElement('a');a.className='dw-plan-nav';a.href='#/week';a.innerHTML='✨ <strong>Generate meal plan</strong>';a.onclick=()=>setTimeout(openPlanner,130);nav.prepend(a)}
 const tabs=document.querySelector('.tabs');if(tabs){const link=tabs.querySelector('a[href="#/week"]');if(link){const span=link.querySelector('span');if(span)span.textContent='Meal Plan'}}
 const banner=document.createElement('button');banner.className='dw-plan-fab';banner.textContent='✨ Plan meals';banner.onclick=()=>{location.hash='#/week';setTimeout(openPlanner,100)};document.body.appendChild(banner)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();