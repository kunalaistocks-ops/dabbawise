/* Make Parent Kitchen and Food Truth first-class discovery destinations. */
(function(){
function init(){
 const tabs=document.querySelector('.tabs');
 if(tabs&&!tabs.querySelector('.dw-community-tab')){
  const entries=[['#/food-truth','🛡','Food Truths','dw-truth-tab'],['#/parent-kitchen','♥','Cook Together','dw-community-tab']];
  for(const [href,emoji,label,cls] of entries){const a=document.createElement('a');a.href=href;a.className='dw-extra-tab '+cls;a.innerHTML='<span class="dw-extra-icon">'+emoji+'</span><span>'+label+'</span>';tabs.appendChild(a)}
 }

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();