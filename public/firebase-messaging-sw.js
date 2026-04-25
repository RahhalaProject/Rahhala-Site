/* Firebase Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
});

firebase.messaging();
