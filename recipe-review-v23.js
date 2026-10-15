/* Cook Together review desk. Authorization is enforced by Supabase RLS, never by the UI. */
(function(){
'use strict';
const URL='https://iyabdhmvbtlhxntzafth.supabase.co';
const KEY='sb_publishable_CFrNt-ICIUYv9culGxLI8w_JoJQFHdp';
const client=()=>window.__dwSupabaseClient||(window.__dwSupabaseClient=window.supabase.createClient(URL,KEY));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let pending=[];
function page(){return '<section class="tpk-review"><span class="tpk-review-eyebrow">COOK TOGETHER · EDITORIAL</span><h1>Recipe review desk</h1><p>Review parent submissions before they appear publicly. Confirm ingredient clarity, attribution, child privacy and age-related safety concerns.</p><div id="tpk-review-status" role="status">Checking your moderator access…</div><div id="tpk-review-list"></div></section>'}
function message(s){const e=document.getElementById('tpk-review-status');if(e)e.textContent=s}
async function load(){
 const container=document.getElementById('tpk-review-list');if(!container)return;
 try{
  const c=client();const {data:{user}}=await c.auth.getUser();
  if(!user){message('Sign in to access the editorial review desk.');return}
  const {data:authorized,error:roleError}=await c.rpc('is_platform_moderator');
  if(roleError)throw roleError;
  if(!authorized){message('This account does not have moderator access. Contact the platform administrator.');return}
  const {data,error}=await c.from('community_recipes').select('id,title,display_name,description,country,meal_type,ingredients,instructions,average_minutes,private_photo_path,created_at').eq('status','pending').order('created_at',{ascending:true}).limit(100);
  if(error)throw error;
  pending=data||[];message(pending.length+' recipe(s) awaiting review.');
  container.innerHTML=pending.length?pending.map(r=>'<article class="tpk-review-card" data-id="'+esc(r.id)+'"><div class="tpk-review-meta">'+esc(r.display_name)+' · '+esc(r.meal_type)+' · '+esc(r.country)+' · '+new Date(r.created_at).toLocaleDateString()+'</div><h2>'+esc(r.title)+'</h2><p>'+esc(r.description)+'</p><h3>Ingredients</h3><p class="tpk-review-copy">'+esc(r.ingredients)+'</p><h3>Method</h3><p class="tpk-review-copy">'+esc(r.instructions)+'</p><p>Reported preparation time: '+esc(r.average_minutes??'Not provided')+' minutes</p>'+(r.private_photo_path?'<button type="button" class="tpk-preview-photo" data-path="'+esc(r.private_photo_path)+'">View food photo</button><img class="tpk-photo" hidden alt="Submitted food photo">':'')+'<label>Moderator note (required for rejection)<textarea rows="2" maxlength="500" placeholder="What should the parent correct?"></textarea></label><div class="tpk-review-actions"><button type="button" data-action="published">Approve & publish</button><button type="button" data-action="rejected">Reject with note</button></div></article>').join(''):'<div class="tpk-review-empty">No submissions awaiting review.</div>';
  container.querySelectorAll('button[data-action]').forEach(b=>b.onclick=()=>decide(b));container.querySelectorAll('.tpk-preview-photo').forEach(b=>b.onclick=()=>preview(b));
 }catch(e){message('Unable to load review queue: '+e.message)}
}
async function preview(button){try{const {data,error}=await client().storage.from('parent-recipe-private').createSignedUrl(button.dataset.path,90);if(error)throw error;const img=button.nextElementSibling;img.src=data.signedUrl;img.hidden=false}catch(e){message('Photo preview unavailable: '+e.message)}}
async function decide(button){
 const card=button.closest('[data-id]');if(!card)return;
 const status=button.dataset.action,note=card.querySelector('textarea').value.trim();
 if(status==='rejected'&&!note){message('Please enter a reason before rejecting.');return}const recipe=pending.find(r=>r.id===card.dataset.id);if(status==='published'&&recipe?.private_photo_path){message('This recipe includes a private photo. The photo will remain private; only the recipe text will be published.');}
 if(!confirm(status==='published'?'Publish this parent recipe publicly?':'Reject this recipe and keep it out of the public feed?'))return;
 card.querySelectorAll('button').forEach(b=>b.disabled=true);
 try{
  let publicPhoto=null;
 if(status==='published'&&recipe?.private_photo_path){
  const allowPhoto=confirm('Publish the photo too? Select OK only after checking child privacy, ownership and personal details. Select Cancel to publish text only.');
  if(allowPhoto){
   const sb=client();
   const {data:blob,error:downloadError}=await sb.storage.from('parent-recipe-private').download(recipe.private_photo_path);
   if(downloadError)throw downloadError;
   const extension=recipe.private_photo_path.split('.').pop();
   const path=recipe.id+'.'+extension;
   const {error:uploadError}=await sb.storage.from('parent-recipe-public').upload(path,blob,{upsert:false,contentType:blob.type||'image/jpeg'});
   if(uploadError)throw uploadError;
   publicPhoto=sb.storage.from('parent-recipe-public').getPublicUrl(path).data.publicUrl;
  }
 }
 const {error}=await client().from('community_recipes').update({status,moderator_note:note||null,photo_url:publicPhoto,photo_reviewed_at:publicPhoto?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq('id',card.dataset.id).eq('status','pending');
  if(error)throw error;
  await load();
 }catch(e){message('Review action failed: '+e.message);card.querySelectorAll('button').forEach(b=>b.disabled=false)}
}
function init(){if(typeof V==='undefined')return;V['recipe-review']=()=>{setTimeout(load,0);return page()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();