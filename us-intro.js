/* Region-specific introduction for US parents, without altering the food engine. */
(function(){
let queued=false;
function apply(){queued=false;const main=document.querySelector('#main');if(!main)return;const us=(()=>{try{return JSON.parse(localStorage.getItem('dw2_region'))==='us'}catch{return false}})();const onHome=location.hash===''||location.hash.startsWith('#/today');const existing=document.querySelector('#dw-us-explainer');
if(!us||!onHome){existing?.remove();return}
if(existing)return;
const block=document.createElement('aside');block.id='dw-us-explainer';block.className='dw-us-explainer';block.innerHTML='<strong>What does Dabbawise mean?</strong>“Dabba” means lunchbox in Hindi. Dabbawise helps families in the US and India understand everyday foods, build balanced lunchboxes and plan practical meals. Choose your country in Settings for local food guidance.';
main.prepend(block)}
function queue(){if(queued)return;queued=true;requestAnimationFrame(apply)}
function init(){const main=document.querySelector('#main');if(!main)return;new MutationObserver(queue).observe(main,{childList:true});addEventListener('hashchange',queue);queue()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();