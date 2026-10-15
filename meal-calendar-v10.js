/* Weekly calendar: prep estimates, meal labels, and optional school routine. */
(function(){
'use strict';
const pref=()=>{try{return JSON.parse(localStorage.getItem('dw2_meal_preferences')||'{}')||{}}catch{return {}}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const label={breakfast:'Breakfast',lunchbox:'Lunchbox',snack:'Snack',dinner:'Dinner'};
const to12=s=>{if(!s)return'';const [h,m]=s.split(':').map(Number);if(!Number.isFinite(h)||!Number.isFinite(m))return '';return (h%12||12)+':'+String(m).padStart(2,'0')+(h>=12?' pm':' am')};
function timetable(p){
 if(!p.schoolStart&&!p.schoolEnd&&!p.schoolLunch&&!p.schoolSnack)return'<p class="dw-school-empty">Add school hours to plan lunch and snacks around your child’s day. <button onclick="window.dwOpenMealPlanner()">Set school times →</button></p>';
 const parts=[['Starts',p.schoolStart],['Snack break',p.schoolSnack],['Lunch break',p.schoolLunch],['Ends',p.schoolEnd]].filter(x=>x[1]);
 return '<section class="dw-week-school"><div><span class="dw-plan-kicker">SCHOOL ROUTINE</span><h3>Plan around their school day</h3><p>School days: '+(p.schoolDays===false?'Not applied to the weekly plan':'Monday–Friday')+'. Times are entered by you, not assumed.</p></div><div class="dw-school-times">'+parts.map(([k,v])=>'<span><b>'+esc(to12(v))+'</b><small>'+esc(k)+'</small></span>').join('')+'</div><button onclick="window.dwOpenMealPlanner()">Edit times</button></section>';
}
function card(day,idx,id,p,school){
 const r=typeof getR==='function'?getR(id):null;if(!r)return'';
 const type=r.type||'snack';
 const isSnack=type==='snack';
 const ids=plan()[day]||[];
 const snackPosition=ids.slice(0,idx+1).filter(x=>getR(x)?.type==='snack').length;
 let time='',title=label[type]||'Meal';
 if(school){
  if(type==='lunchbox'&&p.schoolLunch)time=to12(p.schoolLunch);
  if(isSnack&&p.schoolSnack&&snackPosition===1){title='School snack';time=to12(p.schoolSnack)}
  if(isSnack&&snackPosition>1){title='After-school snack';time='After school'}
  if(type==='breakfast'&&p.schoolStart)time='Before school';
  if(type==='dinner')time='Evening';
 }
 const safeDay=esc(day),name=esc(r.name),rid=encodeURIComponent(r.id);
 return '<div class="dw-week-meal dw-week-'+esc(type)+'"><div class="dw-week-meal-head"><span>'+esc(title)+(time?' · '+esc(time):'')+'</span><small>~'+Number(r.mins||0)+' min average</small></div><div class="dw-week-meal-main"><a href="#/r/'+rid+'">'+name+'</a>'+(window.dwNutriPlanBadge?window.dwNutriPlanBadge(r):'')+'<div class="dw-week-meal-actions"><button aria-label="Move '+name+'" onclick="moveAsk(\''+safeDay+'\','+idx+')">↔</button><button aria-label="Remove '+name+'" onclick="rmPlan(\''+safeDay+'\','+idx+')">×</button></div></div></div>';
}
function build(){
 const p=pref(),days=typeof DAYS!=='undefined'?DAYS:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 const current=typeof plan==='function'?plan():{};
 const total=Object.values(current).flat().length;
 const school=Boolean(p.schoolDays!==false&&(p.schoolStart||p.schoolEnd||p.schoolLunch||p.schoolSnack));
 const cuisine=p.cuisine==='western'?'Western / American':p.cuisine==='indian'?'Indian':'Indo-Western';
 const hero='<section class="dw-planner-hero"><div><span class="dw-plan-kicker">FAMILY MEAL PLANNER</span><h2>Plan meals around real family life.</h2><p>Choose Western, Indian or Indo-Western recipes, and organise lunch and snacks around school hours.</p><button class="dw-plan-main" onclick="window.dwOpenMealPlanner()">✨ Generate or change my plan →</button></div><div class="dw-plan-emoji" aria-hidden="true">🥗</div></section>';
 const actions='<div class="dw-week-top"><div><h1>My Week</h1><p class="mute">Your '+esc(cuisine)+' plan · '+total+' meal ideas · preparation time shown per recipe</p></div><div class="dw-week-buttons"><button onclick="window.dwOpenMealPlanner()">⚙ Preferences</button><button onclick="window.print()">Print</button></div></div>';
 const tabs='<div class="subnav"><a href="#/week" aria-current="page">Plan</a><a href="#/lunchbox">Lunchbox</a><a href="#/shop">Shopping</a><a href="#/saved">Saved</a></div>';
 const routine=(()=>{try{return JSON.parse(localStorage.getItem('dw2_day_routine')||'{}')||{}}catch{return {}}})();const routineBlock=routine.confirmedAt?'<section class="dw-routine-summary"><div><b>🎙 Their day, your plan</b><p>'+[ ['Wake',routine.wake],['Breakfast',routine.breakfast],['School',routine.schoolStart],['Home',routine.home],['Activity',routine.activity],['Dinner',routine.dinner],['Bed',routine.bed]].filter(x=>x[1]).map(x=>esc(x[0])+' '+esc(x[1])).join(' · ')+'</p>'+(routine.activityDetails?'<small>'+esc(routine.activityDetails)+'</small>':'')+'</div><button onclick="window.dwOpenDayRoutine()">Edit routine</button></section>':'';
 const cards='<div class="dw-week-grid">'+days.map((day,i)=>{const items=current[day]||[];const sorted=items.map((id,idx)=>({id,idx,r:getR(id)})).sort((a,b)=>{const rank=x=>{const r=x.r;if(!r)return 9;if(r.type==='breakfast')return 0;if(r.type==='snack'){const n=items.slice(0,x.idx+1).filter(id=>getR(id)?.type==='snack').length;return school&&p.schoolSnack&&n===1?1:3}if(r.type==='lunchbox')return 2;if(r.type==='dinner')return 5;return 4};return rank(a)-rank(b)});return '<section class="dw-week-day"><header><b>'+esc(day)+'</b>'+(i<5&&school?'<span>School day</span>':'')+'</header>'+ (items.length?sorted.map(({id,idx})=>card(day,idx,id,p,school&&i<5)).join(''):'<p class="dw-week-none">No meals planned yet</p>')+'<a class="dw-week-add" href="#/meals">+ Browse meals</a></section>'}).join('')+'</div>';
 const footer=total?'<div class="dw-week-footer"><p>Check allergens, school food rules, storage temperatures and age-appropriate textures before serving.</p><button onclick="weekToShop()">🛒 Add week to shopping list</button></div>':'<p class="dw-week-empty">Start with <button onclick="window.dwOpenMealPlanner()">Generate my meal plan</button>, then adjust any day.</p>';
 return hero+actions+tabs+routineBlock+timetable(p)+cards+footer;
}
function init(){if(typeof V==='undefined')return;V.week=build;if(location.hash.indexOf('#/week')===0)render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();