/* Make Parent Kitchen and Food Truth first-class discovery destinations. */
(function(){
function init(){
 const tabs=document.querySelector('.tabs');
 if(tabs&&!tabs.querySelector('.dw-community-tab')){
  const entries=[['#/food-truth','🛡','Food Truths','dw-truth-tab'],['#/parent-kitchen','♥','Cook Together','dw-community-tab']];
  for(const [href,emoji,label,cls] of entries){const a=document.createElement('a');a.href=href;a.className='dw-extra-tab '+cls;a.innerHTML='<span class="dw-extra-icon">'+emoji+'</span><span>'+label+'</span>';tabs.appendChild(a)}
 }
 if(typeof V!=='undefined'&&V.today&&!V.today.__dwCommunity){
  const prev=V.today;
  const next=function(...args){const html=prev(...args);const cards='<section class="dw-community-feature"><a href="#/food-truth"><span class="dw-feature-icon">🛡</span><span><b>Food Truths</b><small>Check packaged-food labels, sugar and claims</small></span><strong>Explore →</strong></a><a href="#/parent-kitchen"><span class="dw-feature-icon">♥</span><span><b>Cook Together</b><small>Share recipes, get credited and discover parent favourites</small></span><strong>Explore →</strong></a></section>';return cards+html};
  next.__dwCommunity=true;V.today=next;
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();