// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpztMnA4TbUUkc4dXi46CWpZ_aRMQphhI",
  authDomain: "shayapopup-65c4b.firebaseapp.com",
  projectId: "shayapopup-65c4b",
  storageBucket: "shayapopup-65c4b.firebasestorage.app",
  messagingSenderId: "965340159675",
  appId: "1:965340159675:web:3a2f86fbb13d7dc715d39e",
  measurementId: "G-Z83NE4X4RC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;