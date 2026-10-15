/* Editorial-only Food Truths intake: verified evidence required before public release. */
(function(){
const client=()=>window.__dwSupabaseClient;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function page(){return '<section class="ft-editor"><h1>Food Truths editorial desk</h1><p>Record product-label evidence for India or the US. Nothing appears publicly until independently reviewed and verified.</p><div id="ft-editor-status" role="status">Checking access…</div><form id="ft-editor-form" hidden><label>Market<select name="country"><option value="in">India</option><option value="us">USA</option></select></label><label>Product name<input name="product_name" required maxlength="160"></label><label>Brand<input name="brand" maxlength="100"></label><label>Category<input name="category" value="packaged snack" required></label><label>Serving size text<input name="serving_text" placeholder="e.g. 30 g"></label><label>Calories per labelled serving<input name="calories" type="number" step="any" min="0"></label><label>Added sugar (g, if declared)<input name="added_sugar_g" type="number" step="any" min="0"></label><label>Total sugar (g, if declared)<input name="total_sugar_g" type="number" step="any" min="0"></label><label>Protein (g)<input name="protein_g" type="number" step="any" min="0"></label><label>Sodium (mg)<input name="sodium_mg" type="number" step="any" min="0"></label><label>Source URL<input name="evidence_url" type="url" required></label><label>Evidence summary<textarea name="evidence_summary" required minlength="16"></textarea></label><button type="submit">Save for editorial review</button></form><div id="ft-editor-queue"></div></section>'}
function msg(s){const e=document.getElementById('ft-editor-status');if(e)e.textContent=s}
async function initPage(){
 try{
 const c=client();if(!c)throw Error('Sign in first.');
 const {data:allowed,error}=await c.rpc('is_platform_moderator');
 if(error)throw error;if(!allowed){msg('Moderator access required.');return}
 const form=document.getElementById('ft-editor-form');form.hidden=false;
 form.onsubmit=async e=>{
  e.preventDefault();const d=Object.fromEntries(new FormData(form));const record={country:d.country,product_name:d.product_name.trim(),brand:d.brand.trim(),category:d.category.trim(),serving_text:d.serving_text.trim(),evidence_url:d.evidence_url.trim(),evidence_summary:d.evidence_summary.trim(),evidence_type:'label',verified:false};
  for(const k of ['calories','added_sugar_g','total_sugar_g','protein_g','sodium_mg'])record[k]=d[k]===''?null:Number(d[k]);
  const {error}=await c.from('food_truth_items').insert(record);
  if(error){msg(error.message);return}form.reset();msg('Draft saved privately for review.');await queue();
 };
 await queue();
 }catch(e){msg('Editorial desk unavailable: '+e.message)}
}
async function queue(){
 const c=client(),box=document.getElementById('ft-editor-queue');if(!box)return;
 const {data,error}=await c.from('food_truth_items').select('id,product_name,brand,country,evidence_url,evidence_summary,reviewed_at,verified').eq('verified',false).order('created_at',{ascending:false}).limit(50);
 if(error){msg(error.message);return}
 box.innerHTML='<h2>Awaiting verification ('+data.length+')</h2>'+data.map(r=>'<article><b>'+esc(r.product_name)+'</b><p>'+esc(r.brand)+' · '+esc(r.country)+'</p><p>'+esc(r.evidence_summary)+'</p><a href="'+esc(r.evidence_url)+'" target="_blank" rel="noopener noreferrer">Review source ↗</a><button type="button" data-id="'+esc(r.id)+'">Mark independently verified</button></article>').join('');
 box.querySelectorAll('[data-id]').forEach(b=>b.onclick=async()=>{
  if(!confirm('Have you independently checked the CURRENT label, source URL, serving size and all entered values?'))return;
  const {error}=await c.from('food_truth_items').update({verified:true,reviewed_at:new Date().toISOString()}).eq('id',b.dataset.id).eq('verified',false);
  if(error){msg(error.message);return}msg('Verified record published.');queue();
 });
}
function boot(){if(typeof V!=='undefined')V['food-truth-editor']=()=>{setTimeout(initPage,0);return page()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();