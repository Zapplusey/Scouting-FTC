import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAx3yqOSfyTrKJYQ10Tq73UtIQmusj3z1k",
  authDomain: "scounting16473.firebaseapp.com",
  projectId: "scounting16473",
  storageBucket: "scounting16473.appspot.com",
  messagingSenderId: "899338740838",
  appId: "1:899338740838:web:f32c8ab117e28fe039b9a7",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
