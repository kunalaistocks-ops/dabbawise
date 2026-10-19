/* The Parent Kitchen — pure nutrition input validator. Staged only, no UI wiring. */
(function(root,factory){
'use strict';
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
if(root) root.TPKNutritionV31=api;
})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const DECIMAL=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const LIMITS={servings:[1,50],weight:[0.000001,20000],kcal:[0,1000],protein:[0,100],fiber:[0,100]};
function numeric(value,kind,optional){
 if(value===null||value===undefined||(typeof value==='string'&&!value.trim()))
  return optional?{ok:true,value:null}:{ok:false,error:kind+' is required.'};
 if(typeof value!=='number'&&typeof value!=='string')return{ok:false,error:kind+' must be a number.'};
 const raw=String(value).trim();
 if(!DECIMAL.test(raw))return{ok:false,error:kind+' must be a finite decimal number.'};
 const n=Number(raw), bounds=LIMITS[kind];
 if(!Number.isFinite(n)||n<bounds[0]||n>bounds[1])return{ok:false,error:kind+' is outside its allowed range.'};
 if(kind==='servings'&&!Number.isInteger(n))return{ok:false,error:'servings must be a whole number.'};
 return{ok:true,value:n};
}
function computeRecipeNutrition(input){
 if(!input||typeof input!=='object')return{ok:false,error:'Recipe input is required.'};
 const servings=numeric(input.servings,'servings',false);
 if(!servings.ok)return servings;
 if(!Array.isArray(input.rows)||!input.rows.length||input.rows.length>100)return{ok:false,error:'Enter between 1 and 100 ingredients.'};
 const rows=[];
 for(const source of input.rows){
  if(!source||typeof source!=='object')return{ok:false,error:'Invalid ingredient.'};
  const entry={ingredient:String(source.ingredient??'').trim()};
  for(const key of ['weight','kcal','protein','fiber']){
   const parsed=numeric(source[key],key,key==='protein'||key==='fiber');
   if(!parsed.ok)return parsed;
   entry[key]=parsed.value;
  }
  rows.push(entry);
 }
 const hasProtein=rows.every(r=>r.protein!==null),hasFiber=rows.every(r=>r.fiber!==null);
 const total={kcal:0,protein:hasProtein?0:null,fiber:hasFiber?0:null};
 for(const row of rows){
  total.kcal+=row.weight*row.kcal/100;
  if(hasProtein)total.protein+=row.weight*row.protein/100;
  if(hasFiber)total.fiber+=row.weight*row.fiber/100;
 }
 const perServing={kcal:total.kcal/servings.value,protein:hasProtein?total.protein/servings.value:null,fiber:hasFiber?total.fiber/servings.value:null};
 if(!Object.values(total).every(n=>n===null||Number.isFinite(n))||!Object.values(perServing).every(n=>n===null||Number.isFinite(n)))return{ok:false,error:'Calculation could not produce finite results.'};
 return{ok:true,value:{complete:true,basis:'per serving',source:'parent-entered values (unverified)',servings:servings.value,rows,total,perServing,omitted:{protein:!hasProtein,fiber:!hasFiber}}};
}
function safeCalories(snapshot){
 if(!snapshot||snapshot.complete!==true||!snapshot.perServing||typeof snapshot.perServing.kcal!=='number')return null;
 const n=snapshot.perServing.kcal;
 return Number.isFinite(n)&&n>=0&&n<=1000000?Math.round(n):null;
}
return Object.freeze({computeRecipeNutrition,safeCalories});
});