// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { Firestore, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "testmins-a6423.firebaseapp.com",
  projectId: "testmins-a6423",
  storageBucket: "testmins-a6423.firebasestorage.app",
  messagingSenderId: "228202843169",
  appId: "1:228202843169:web:2b5cc8fa2516ea458b2760"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const db = getFirestore(app);
