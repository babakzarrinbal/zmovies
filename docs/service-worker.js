importScripts("/zmovies/precache-manifest.3abe05f7630df6f7657625fbce350bfc.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

self.addEventListener("install", function(event) {
  // console.log("Service Worker installing.");
});

self.addEventListener("activate", function(event) {
  // console.log("Service Worker activating.");
});
self.addEventListener("fetch", function(e) {
  // console.log("fetched", e.request.url);
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

