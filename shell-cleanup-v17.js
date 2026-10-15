/* Simplified responsive shell: no overlapping floating controls. */
(function(){
function init(){
 const top=document.querySelector('.top');
 if(!top)return;
 let strip=document.querySelector('#tpk-utility');
 if(!strip){strip=document.createElement('div');strip.id='tpk-utility';strip.setAttribute('aria-label','Account and tools');top.insertAdjacentElement('afterend',strip)}
 const ids=['usda-open','dw-sync-btn','dw-account-btn'];
 for(const id of ids){const b=document.getElementById(id);if(b){strip.appendChild(b);if(id==='usda-open')b.textContent='🔬 USDA nutrition';if(id==='dw-sync-btn')b.textContent='☁ Save / restore';}}
 const logo=document.querySelector('.side .logo');
 if(logo)logo.title='The Parent Kitchen — home';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();