/* Mobile navigation parity with desktop: five clear destinations and an accessible More menu. */
(function(){
const links=[
 ['#/parent-kitchen','♥','Cook Together','Share and discover parent recipes'],
 ['#/meals','🍲','Recipes','Browse breakfast, lunchbox, snacks and dinner'],
 ['#/heal','🌱','Grow Well','Nutrition, growth and food-safety guidance'],
 ['#/experts','👩‍⚕️','Experts','Read educational insights and sources'],
 ['#/settings','⚙','Settings','Country, preferences and account options']
];
function openMenu(){
 document.getElementById('tpk-mobile-menu')?.remove();
 const overlay=document.createElement('div');overlay.id='tpk-mobile-menu';
 overlay.innerHTML='<section class="tpk-mobile-sheet" role="dialog" aria-modal="true" aria-labelledby="tpk-mobile-title"><div class="tpk-mobile-sheet-head"><h2 id="tpk-mobile-title">Explore The Parent Kitchen</h2><button type="button" aria-label="Close menu" id="tpk-mobile-close">×</button></div><p>What would you like to do?</p><div class="tpk-mobile-options">'+links.map(([url,icon,label,desc])=>'<a href="'+url+'"><span>'+icon+'</span><span><b>'+label+'</b><small>'+desc+'</small></span><strong>→</strong></a>').join('')+'</div></section>';
 document.body.appendChild(overlay);
 overlay.querySelector('#tpk-mobile-close').onclick=()=>overlay.remove();
 overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.closest('.tpk-mobile-options a'))overlay.remove()});
 const onKey=e=>{if(e.key==='Escape'){overlay.remove();document.removeEventListener('keydown',onKey)}};
 document.addEventListener('keydown',onKey);
 overlay.querySelector('#tpk-mobile-close').focus();
}
function init(){
 const nav=document.querySelector('.tabs');if(!nav)return;
 nav.querySelectorAll('.tpk-primary-tab').forEach(el=>el.classList.add('tpk-desktop-only'));
 for(const key of ['meals','heal']){const a=nav.querySelector('a[data-t="'+key+'"]');if(a)a.classList.add('tpk-mobile-secondary')}
 const week=nav.querySelector('a[data-t="week"]');if(week)week.classList.add('tpk-mobile-plan');
 const food=nav.querySelector('.tpk-main-truth');if(food)food.classList.add('tpk-mobile-truth');
 if(!nav.querySelector('#tpk-mobile-more')){
  const b=document.createElement('button');b.type='button';b.id='tpk-mobile-more';b.className='tpk-mobile-more';b.setAttribute('aria-label','More sections');b.innerHTML='<span aria-hidden="true">☰</span><span>More</span>';b.onclick=openMenu;nav.appendChild(b);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();