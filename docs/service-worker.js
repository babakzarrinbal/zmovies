importScripts("/zmovies/precache-manifest.2585c6ada9693b872c44afd91cad80b8.js", "/zmovies/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/zmovies/workbox-v3.6.3"});
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open('offlinecaches').then(function(cache) {
      return cache.addAll(
        [
          '/zmovies/index.html'
        ]
      );
    })
  );
});

self.addEventListener("activate", function(event) {
  // console.log("Service Worker activating.");
});
self.addEventListener("fetch", function(event) {
  event.respondWith(function(){
    return caches.match(event.request).then(function(response) {
      // console.log('response',response.text());
      // response.then('cacheresult',console.log);
        if (response) {
            // retrieve from cache
            return response;
        }
        // if not found in cache, return default offline content (only if this is a navigation request)
        if (event.request.mode === 'navigate') {
            return caches.match('/zmovies/index.html');
        }

        // fetch as normal
        return fetch(event.request);

      });
    });
});

self.addEventListener("push", function(event) {
  var data = event.data.json();
  const title = data.title || "Driver @ Dilivir";
  const options = {
    body: data.body || "New orders",
    icon: data.icon || "img/icons/logo.png",
    badge: data.badge || "img/icons/logo.png",
    data,
  };

  if (data.tag) options.tag = data.tag;
  const notificationPromise = self.registration.showNotification(
    title,
    options
  );
  event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      "http://localhost:5000/#/" + (event.notification.data || {}).gotourl || ""
    )
  );
});

