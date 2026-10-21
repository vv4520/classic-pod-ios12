/* Only app assets are cached. Imported music stays in IndexedDB on this device. */
var CACHE = 'classic-pod-shell-v3';
var ASSETS = ['./','./index.html','./style.css','./app.js','./vendor/jsmediatags.min.js','./manifest.webmanifest','./icon.png','./icon-512.png'];
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(function(cache){return cache.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key.indexOf('classic-pod-shell-')===0 && key!==CACHE;}).map(function(key){return caches.delete(key);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(function(response){return response||fetch(event.request).catch(function(error){if(event.request.mode==='navigate')return caches.match('./index.html');throw error;});}));
});
