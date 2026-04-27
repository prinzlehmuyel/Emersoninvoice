// Firebase Messaging Service Worker
// This file must be at the ROOT of your GitHub repo

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDbLnQ1lOqVPXFNR8n34k4VOfcBXXHf1Jw",
  authDomain: "emerson-global-ordering.firebaseapp.com",
  projectId: "emerson-global-ordering",
  storageBucket: "emerson-global-ordering.firebasestorage.app",
  messagingSenderId: "927784326835",
  appId: "1:927784326835:web:e45ab356a00438406a42c6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || '🛒 New Order — Emerson Global';
  const notificationOptions = {
    body: payload.notification?.body || 'A new order has been placed on the website.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: '📋 View Order' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If invoice app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('Emersoninvoice') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open it
      return clients.openWindow('https://prinzlehmuyel.github.io/Emersoninvoice');
    })
  );
});
