/* App updates never delete the IndexedDB music library. */
var RELEASE = '0.2.0';
var CACHE = 'classic-pod-shell-v4';
var ASSETS = ['./','./index.html','./style.css','./app.js','./vendor/jsmediatags.min.js','./manifest.webmanifest','./icon.png','./icon-512.png'];
var URLS = ASSETS.map(function(path){return new URL(path,self.location.href).href;});
self.addEventListener('install',function(event){
  event.waitUntil(caches.open(CACHE).then(function(cache){
    return Promise.all(URLS.map(function(url){
      return fetch(url+'?pod-release='+RELEASE).then(function(response){
        if(!response.ok)throw new Error('App asset unavailable');
        return cache.put(url,response);
      });
    }));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(event){
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(key){return key.indexOf('classic-pod-shell-')===0&&key!==CACHE;}).map(function(key){return caches.delete(key);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET')return;
  var url=new URL(event.request.url);
  url.search='';url.hash='';
  var key=url.href;
  if(URLS.indexOf(key)<0)return;
  /* Prefer current app files online; retain a complete shell for offline use. */
  event.respondWith(caches.open(CACHE).then(function(cache){
    return fetch(event.request).then(function(response){
      if(!response.ok)throw new Error('App asset unavailable');
      event.waitUntil(cache.put(key,response.clone()));
      return response;
    }).catch(function(error){
      return cache.match(key).then(function(response){if(response)return response;throw error;});
    });
  }));
});
