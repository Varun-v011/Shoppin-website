// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAxV-xUHq3LgC4ywm2PliNGSmEW8EUCE6I",
  authDomain: "shoppin-web-caa69.firebaseapp.com",
  projectId: "shoppin-web-caa69",
  storageBucket: "shoppin-web-caa69.firebasestorage.app",
  messagingSenderId: "84564091938",
  appId: "1:84564091938:web:b836ffe5d6e5bfef11d67b",
  measurementId: "G-7FMRFTZGR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;