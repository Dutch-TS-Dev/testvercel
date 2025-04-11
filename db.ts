import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore"; // Import Firestore
dotenv.config({ path: "./.env.local" });

const app = initializeApp({
  apiKey: "AIzaSyBO8vpl6dF48Y6h2643O870X5-WxZ8RgWY",
  authDomain: "login-a40a3.firebaseapp.com",
  projectId: "login-a40a3",
  storageBucket: "login-a40a3.firebasestorage.app",
  messagingSenderId: "1073773324090",
  appId: "1:1073773324090:web:87dd8bba1ead9436c3d203",

  //    apiKey: 'AIzaSyA0E2nL2hCqoxdS8Rr-sHwlOlwqS2atJgg',
  //    authDomain: 'coincloud-live.firebaseapp.com',
  //    projectId: 'coincloud-live',
  //    storageBucket: 'coincloud-live.appspot.com',  messagingSenderId: '802403017725',
  //    appId: '1:802403017725:web:a4b82b86c81339c8d9ef94',
  //   measurementId: 'G-GBEW3C1TVW'
});

export const auth = getAuth(app);
export const db = getFirestore(app);
