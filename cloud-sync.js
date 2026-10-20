/* Dabbawise cloud sync — explicit, parent-controlled, never automatic. */
(function(){
'use strict';
const CONFIG=window.__dwPublicConfig;
if(!CONFIG||CONFIG.environment!=="staging"||!CONFIG.url.includes("siiwuukihzwkmgutijyl.supabase.co"))throw Error("QA Supabase configuration missing or unsafe");
const URL=CONFIG.url,KEY=CONFIG.publishableKey;
const KEY='sb_publishable_CFrNt-ICIUYv9culGxLI8w_JoJQFHdp';
const PREFIX='dw2_qa_';
const ALLOWED=['region','kids','goals','saved','onboarded','units','meal_preferences','day_routine'];
const INCLUDED_PREFIXES=['plan_','boxes_','shop_','done_'];
const allowed=k=>ALLOWED.includes(k)||INCLUDED_PREFIXES.some(p=>k.startsWith(p));
let sb=null;
function client(){if(!window.supabase?.createClient)throw Error('Cloud library could not load');return sb||(sb=window.__dwSupabaseClient||(window.__dwSupabaseClient=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:CONFIG.storageKey}})))}
async function currentUser(){const {data,error}=await client().auth.getUser();if(error)throw error;return data.user}
function localState(){const out={};for(let i=0;i<localStorage.length;i++){const full=localStorage.key(i);if(!full?.startsWith(PREFIX))continue;const k=full.slice(PREFIX.length);if(!allowed(k))continue;const raw=localStorage.getItem(full);if(raw!==null){try{out[k]=JSON.parse(raw)}catch{}}}return out}
function message(text){const e=document.querySelector('#dw-sync-status');if(e)e.textContent=text}
async function save(){const u=await currentUser();if(!u)throw Error('Sign in first.');const state=localState();if(!confirm('Save your family preferences, child profiles, and meal plans to your private cloud account? This may include allergy information you entered.'))return;const {error}=await client().from('app_snapshots').upsert({user_id:u.id,state,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;message('Saved to your private account.')}
async function restore(){const u=await currentUser();if(!u)throw Error('Sign in first.');const {data,error}=await client().from('app_snapshots').select('state,updated_at').eq('user_id',u.id).maybeSingle();if(error)throw error;if(!data){message('No cloud backup found for this account.');return}if(!confirm('Replace your current local Dabbawise settings, child profiles and plans with the cloud backup?'))return;for(const [k,v] of Object.entries(data.state||{})){if(allowed(k))localStorage.setItem(PREFIX+k,JSON.stringify(v))}message('Cloud backup restored. Reloading…');location.reload()}
function open(){document.querySelector('#dw-sync-overlay')?.remove();const el=document.createElement('div');el.id='dw-sync-overlay';el.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="dw-sync-title" class="dw-sync-dialog"><button class="dw-sync-close" aria-label="Close">×</button><h2 id="dw-sync-title">Your private family backup</h2><p>Keep your saved meal plans and family preferences available across devices. Backups happen only when you choose.</p><button id="dw-sync-save">Save to cloud</button><button id="dw-sync-load">Restore from cloud</button><p id="dw-sync-status" role="status"></p><p class="dw-sync-note">You must be signed in. Never store passwords or sensitive clinical records in your profile. Review your allergy information before relying on any recipe.</p></section>';document.body.appendChild(el);el.querySelector('.dw-sync-close').onclick=()=>el.remove();el.onclick=e=>{if(e.target===el)el.remove()};el.querySelector('#dw-sync-save').onclick=()=>save().catch(e=>message('Save failed: '+(e.message||'unknown error')+' — please send us this exact message.'));el.querySelector('#dw-sync-load').onclick=()=>restore().catch(e=>message('Restore failed: '+(e.message||'unknown error')));currentUser().then(u=>message(u?'Signed in. Ready to back up.':'Not signed in. Please sign in with Google first.')).catch(e=>message('Authentication check failed: '+e.message))}
function init(){const b=document.createElement('button');b.id='dw-sync-btn';b.textContent='☁ Backup';b.type='button';b.title='Save or restore your family data';b.onclick=open;document.body.appendChild(b)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
