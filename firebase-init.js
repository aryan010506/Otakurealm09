// ── Firebase Initialization ─────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAjb55HgZB8mGuTyVKyuS7GAH64nULsICg",
  authDomain: "otakurealm09-9ba21.firebaseapp.com",
  projectId: "otakurealm09-9ba21",
  storageBucket: "otakurealm09-9ba21.firebasestorage.app",
  messagingSenderId: "841156821897",
  appId: "1:841156821897:web:e53f20852f0a612e399758"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
window.db = firebase.firestore();
console.log("🔥 Firebase globally connected!");