// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBt8LlkBzkcb0JIo1GEopL9REh8_Jm_1ec",
  authDomain: "housefix-23462.firebaseapp.com",
  projectId: "housefix-23462",
  storageBucket: "housefix-23462.firebasestorage.app",
  messagingSenderId: "314241854482",
  appId: "1:314241854482:web:8c2e07dde2980d0d41bccb",
  measurementId: "G-7HYJTBT7YC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
