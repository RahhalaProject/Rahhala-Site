/* Firebase Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const hasRequiredConfig =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.messagingSenderId &&
  !!firebaseConfig.appId;

if (hasRequiredConfig) {
  firebase.initializeApp(firebaseConfig);
  firebase.messaging();
} else {
  // Skip messaging init until real Firebase config values are provided.
  console.warn('firebase-messaging-sw: Firebase config is incomplete.');
}
