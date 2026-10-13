const C='dabbawise-v8';const F=['./','index.html','app.css','content.js','static.js','experts.js','heal.js','app.js','v6/art.js','v6/copy.js','v6/ui6.js','v6/ui6.css','v7/ui7.css','v8/ui8.css','v8/foods.js','v8/illness.js','v8/topics.js','v8/ui8.js','v7/art7.js','v7/answers.js','v7/recipes.js','fonts/fraunces.woff2','fonts/jakarta.woff2','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// network-first so updates land immediately; cache is the offline fallback
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(n=>{const cl=n.clone();caches.open(C).then(c=>c.put(e.request,cl));return n}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
