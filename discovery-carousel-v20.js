/* Parent Kitchen guided discovery — rotating overview and accessible navigation previews. */
(function(){
'use strict';
const features=[
 {icon:'🥗',tag:'DABBAWISE · MEAL PLANNING',title:'Never wonder what to pack for lunch again.',description:'Tell us about school, activities and food preferences. Build an editable week of breakfasts, lunchboxes, snacks and dinners.',cta:'Plan my child’s meals',href:'#/week',color:'mint'},
 {icon:'🍎',tag:'FOODPEDIA · NUTRITION',title:'Is this food right for my child?',description:'Look up everyday ingredients, explore nutrients, and see age-aware food guidance. Source-linked USDA lookup is available.',cta:'Explore food and nutrients',href:'#/explore',color:'peach'},
 {icon:'🛡️',tag:'FOOD TRUTHS · PACKAGED FOODS',title:'Know what’s really inside the packet.',description:'Learn to read labels, compare sugar and nutrition claims, and browse independently verified product information as the catalogue grows.',cta:'Check a packaged food',href:'#/food-truth',color:'butter'},
 {icon:'🌱',tag:'GROW WELL · FAMILY GUIDANCE',title:'Understand food, growth and everyday worries.',description:'Find practical guidance about nutrition, food safety and feeding questions. Educational guidance is not a medical diagnosis.',cta:'Explore Grow Well',href:'#/heal',color:'mint'},
 {icon:'♥',tag:'COOK TOGETHER · COMMUNITY',title:'Discover what other parents are making.',description:'Find family recipes, share your own idea by text or voice, and receive creator credit after moderation.',cta:'Discover parent recipes',href:'#/parent-kitchen',color:'rose'}
];
const descriptions={
 today:'Start here. See the ways The Parent Kitchen helps with food choices, meal planning and parent recipes.',
 explore:'Search everyday foods to understand nutrients, benefits, age suitability and practical serving ideas.',
 meals:'Browse breakfast, lunchbox, snack and dinner recipes. Open a recipe for ingredients and preparation.',
 heal:'Explore child nutrition, growth, food safety and everyday feeding questions.',
 week:'Generate and edit a weekly meal plan, including school times and snacks.',
 'food-truth':'Understand packaged-food labels and marketing claims. Verified product coverage is still expanding.',
 'parent-kitchen':'Discover community recipes, submit your own food ideas and receive creator credit after review.',
 experts:'Find expert-led food and nutrition education and sources.',
 guides:'Read step-by-step family food guides.',
 tools:'Explore additional practical parenting food tools.',
 settings:'Set country, family preferences and application options.',
};
let timer=null,idx=0,paused=false;
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function html(){
 return '<section id="tpk-tour" class="tpk-tour" aria-label="Discover what The Parent Kitchen can do"><div class="tpk-tour-top"><span>DISCOVER THE PARENT KITCHEN</span><span class="tpk-tour-count" id="tpk-tour-count">1 / '+features.length+'</span></div><div class="tpk-tour-slide" id="tpk-tour-slide" aria-live="off"></div><div class="tpk-tour-controls"><div class="tpk-tour-dots" role="group" aria-label="Choose a feature">'+features.map((f,i)=>'<button type="button" class="tpk-tour-dot" data-slide="'+i+'" aria-label="Show '+f.tag.split(' · ')[0]+'"></button>').join('')+'</div><div class="tpk-tour-buttons"><button type="button" id="tpk-tour-prev" aria-label="Previous feature">←</button><button type="button" id="tpk-tour-pause" aria-label="Pause carousel">Ⅱ Pause</button><button type="button" id="tpk-tour-next" aria-label="Next feature">→</button></div></div></section>';
}
function paint(){
 const root=document.getElementById('tpk-tour');if(!root)return;
 const f=features[idx];root.dataset.tone=f.color;
 const slot=root.querySelector('#tpk-tour-slide');
 slot.innerHTML='<div class="tpk-tour-copy"><span class="tpk-tour-tag">'+f.tag+'</span><h2>'+f.title+'</h2><p>'+f.description+'</p><a href="'+f.href+'" class="tpk-tour-cta">'+f.cta+' →</a></div><div class="tpk-tour-illustration" aria-hidden="true"><span>'+f.icon+'</span></div>';
 root.querySelector('#tpk-tour-count').textContent=(idx+1)+' / '+features.length;
 root.querySelectorAll('.tpk-tour-dot').forEach((b,i)=>{b.classList.toggle('active',i===idx);b.setAttribute('aria-current',i===idx?'true':'false')});
}
function next(d=1){idx=(idx+d+features.length)%features.length;paint()}
function stop(){if(timer!==null){clearInterval(timer);timer=null}}
function start(){stop();if(paused||reduced()||document.hidden)return;timer=setInterval(()=>{const root=document.getElementById('tpk-tour');if(!root){stop();return}next()},6500)}
function setup(){
 const root=document.getElementById('tpk-tour');if(!root||root.dataset.ready)return;
 root.dataset.ready='1';paint();
 root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',stop);root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))start()});
 root.querySelector('#tpk-tour-prev').onclick=()=>{next(-1);start()};
 root.querySelector('#tpk-tour-next').onclick=()=>{next(1);start()};
 root.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>{idx=Number(b.dataset.slide);paint();start()});
 root.querySelector('#tpk-tour-pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'▶ Play':'Ⅱ Pause';e.currentTarget.setAttribute('aria-label',paused?'Play carousel':'Pause carousel');paused?stop():start()};
 start();
}
function init(){
 if(typeof V==='undefined'||typeof V.today!=='function')return;
 const prev=V.today;
 if(!prev.__tpkTour){
   const wrapped=function(...args){return html()+prev(...args)};
   wrapped.__tpkTour=true;V.today=wrapped;
 }
 const main=document.getElementById('main');
 if(main){new MutationObserver(()=>{if(location.hash==='#/today'||location.hash===''||location.hash==='#/'){setup()}else stop()}).observe(main,{childList:true})}
 setup();
 addEventListener('visibilitychange',()=>{document.hidden?stop():start()});
 installNavHints();
}
function installNavHints(){
 const sidebar=document.querySelector('.side');if(!sidebar)return;
 const popup=document.createElement('div');popup.id='tpk-nav-preview';popup.setAttribute('role','tooltip');popup.hidden=true;document.body.appendChild(popup);
 let active=null;
 function hide(){popup.hidden=true;active=null}
 function show(a){const href=a.getAttribute('href')||'';const key=href.replace('#/','');const desc=descriptions[key];if(!desc)return;active=a;popup.textContent=desc;popup.hidden=false;const rect=a.getBoundingClientRect();const width=Math.min(280,window.innerWidth-20);const left=Math.min(rect.right+12,window.innerWidth-width-10);popup.style.left=Math.max(10,left)+'px';popup.style.top=Math.max(8,Math.min(rect.top,window.innerHeight-popup.offsetHeight-10))+'px';}
 sidebar.addEventListener('mouseover',e=>{const a=e.target.closest('a[href^="#/"]');if(a&&a!==active)show(a)});
 sidebar.addEventListener('focusin',e=>{const a=e.target.closest('a[href^="#/"]');if(a)show(a)});
 sidebar.addEventListener('mouseout',e=>{if(!sidebar.contains(e.relatedTarget))hide();else if(e.target.closest('a')&&!e.target.closest('a').contains(e.relatedTarget))hide()});
 sidebar.addEventListener('focusout',e=>{if(!sidebar.contains(e.relatedTarget))hide()});
 sidebar.addEventListener('click',hide);
 addEventListener('scroll',hide,{passive:true});addEventListener('resize',hide);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();