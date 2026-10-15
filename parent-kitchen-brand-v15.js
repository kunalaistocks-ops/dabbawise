/* The Parent Kitchen — umbrella identity; existing Dabbawise features preserved. */
(function(){
'use strict';
const logo='<span class="tpk-wordmark">the parent kitchen<span class="tpk-dot">.</span></span>';
function rebrand(){
 document.querySelectorAll('a.logo').forEach(a=>{a.innerHTML=logo;a.setAttribute('aria-label','The Parent Kitchen — home')});
 const nav=document.querySelector('.sidex');
 if(nav&&!nav.querySelector('.tpk-nav-heading')){
  const head=document.createElement('div');head.className='tpk-nav-heading';head.textContent='THE PARENT KITCHEN';nav.prepend(head);
 }
}
function homePanel(){
 return '<section class="tpk-hub" aria-label="The Parent Kitchen"><div class="tpk-hub-head"><span class="tpk-hub-name">the parent kitchen.</span><h2>Better food. Stronger bonds. Healthier futures.</h2><p>One place to understand what children eat, plan meals, support healthy growth and enjoy food together.</p></div><div class="tpk-hub-grid"><a href="#/week"><span class="tpk-hub-symbol">🥗</span><b>Dabbawise</b><small>Lunchboxes & meal planning</small><span class="tpk-hub-arrow">Explore →</span></a><a href="#/food-truth"><span class="tpk-hub-symbol">🛡️</span><b>Food Truth</b><small>Packaged-food intelligence</small><span class="tpk-hub-arrow">Explore →</span></a><a href="#/heal"><span class="tpk-hub-symbol">🌱</span><b>Grow Well</b><small>Nutrition & development</small><span class="tpk-hub-arrow">Explore →</span></a><a href="#/parent-kitchen"><span class="tpk-hub-symbol">♥</span><b>Cook Together</b><small>Family bonding & community recipes</small><span class="tpk-hub-arrow">Explore →</span></a></div></section>';
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