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
 nav.querySelectorAll('a[data-t="explore"],a[data-t="meals"]').forEach(a=>a.classList.add('tpk-mobile-hidden'));
 const today=nav.querySelector('a[data-t="today"]');
 const week=nav.querySelector('a[data-t="week"]');
 const heal=nav.querySelector('a[data-t="heal"]');
 const truth=nav.querySelector('.tpk-main-truth');
 const community=nav.querySelector('.tpk-main-community');
 if(week){week.classList.add('tpk-mobile-show');const label=week.querySelector('span');if(label)label.textContent='Dabbawise'}
 if(heal){heal.classList.add('tpk-mobile-show');const label=heal.querySelector('span');if(label)label.textContent='Grow Well'}
 for(const a of [truth,community])if(a)a.classList.add('tpk-mobile-show');
 const more=nav.querySelector('#tpk-mobile-more');more?.remove();
 if(today&&week&&truth&&heal&&community){for(const a of [today,week,truth,heal,community])nav.appendChild(a)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();