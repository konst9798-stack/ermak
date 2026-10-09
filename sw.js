const CACHE='ermak-ab5c711b', MEDIA='ermak-media';
const CORE=["./", "index.html", "manifest.webmanifest", "media.json", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png", "img2/hero.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==MEDIA).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/media.json')){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(/\/(img2?|photo)\//.test(u.pathname)?MEDIA:CACHE).then(c=>c.put(e.request,cp))}
    return res})))
});
