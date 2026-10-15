/* The Parent Kitchen — umbrella identity; existing Dabbawise features preserved. */
(function(){
'use strict';
const logo='<span class="tpk-wordmark">the parent kitchen<span class="tpk-dot">.</span></span>';
function rebrand(){
 document.querySelectorAll('a.logo').forEach(a=>{a.innerHTML=logo;a.setAttribute('aria-label','The Parent Kitchen — home')});
 const nav=document.querySelector('.sidex');
 if(nav){
   nav.querySelectorAll('.dw-food-truth-nav,.dw-parent-nav,.dw-plan-nav,.dw-day-nav,.tpk-nav-heading,.tpk-home-link').forEach(el=>el.remove());
   if(!nav.querySelector('.tpk-home-link')){
     const a=document.createElement('a');a.href='#/today';a.className='tpk-home-link';a.textContent='⌂ See all options';nav.prepend(a);
   }
 }
 const tabs=document.querySelector('.tabs');
 if(tabs){
   tabs.querySelectorAll('.dw-extra-tab').forEach(el=>el.remove());
   const rename={'explore':'Foodpedia','meals':'Recipes','heal':'Grow Well','week':'Meal Planner'};
   tabs.querySelectorAll('a[data-t]').forEach(a=>{
      const label=a.querySelector('span');const key=a.dataset.t;
      if(label&&rename[key])label.textContent=rename[key];
   });
   if(!tabs.querySelector('.tpk-main-truth')){
     for(const [url,icon,label,cls] of [['#/food-truth','♧','Food Truths','tpk-main-truth'],['#/parent-kitchen','♥','Cook Together','tpk-main-community']]){
       const a=document.createElement('a');a.href=url;a.className='tpk-primary-tab '+cls;
       a.innerHTML='<span class="tpk-tab-icon">'+icon+'</span><span>'+label+'</span>';
       tabs.appendChild(a);
     }
   }
 }
}
function homePanel(){
 return '<section class="tpk-start" aria-label="What you can do in The Parent Kitchen"><div class="tpk-start-top"><span class="tpk-eyebrow">WELCOME TO THE PARENT KITCHEN</span><h1>What would you like to do today?</h1><p>Choose what you need. Explore freely, or sign in when you want to save your family’s plans.</p></div><div class="tpk-start-grid"><a href="#/week"><span class="tpk-start-icon">🥗</span><b>Plan my child’s meals</b><small>Build a week of breakfasts, lunchboxes, snacks and dinners around school and activities.</small><em>Open meal planner →</em></a><a href="#/food-truth"><span class="tpk-start-icon">🛡️</span><b>Check a packaged food</b><small>Understand food labels, sugar and health claims using verified evidence where available.</small><em>Explore Food Truths →</em></a><a href="#/explore"><span class="tpk-start-icon">🌱</span><b>Find out if a food is good</b><small>Search nutrients, age-appropriate guidance and practical ways to serve everyday foods.</small><em>Search Foodpedia →</em></a><a href="#/parent-kitchen"><span class="tpk-start-icon">♥</span><b>Get ideas from other parents</b><small>Discover family recipes or share your own and receive creator credit after review.</small><em>Open Cook Together →</em></a></div><div class="tpk-start-shortcuts"><button type="button" onclick="window.dwOpenDayRoutine?.()">🎙 Tell us about their day</button><button type="button" onclick="window.dwOpenMealPlanner?.()">✨ Generate a meal plan</button><a href="#/heal">Explore nutrition & growth →</a></div><p class="tpk-start-hint">No registration needed to explore. Personalised plans and community submissions require a parent account. Some features and verified product records are still being developed.</p></section>';
}
function init(){
 rebrand();
 if(typeof V!=='undefined'&&typeof V.today==='function'&&!V.today.__tpk){
  const prev=V.today;
  const next=function(...args){return homePanel()+prev(...args)};
  next.__tpk=true;V.today=next;
 }
 document.title='The Parent Kitchen — Better food. Stronger bonds. Healthier futures.';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();