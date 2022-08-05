import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUn2VIfnAbpAarTbW4yl0ybI-8Lv_O80c",
  authDomain: "e-commerce-29d34.firebaseapp.com",
  databaseURL: "https://e-commerce-29d34.firebaseio.com",
  projectId: "e-commerce-29d34",
  storageBucket: "e-commerce-29d34.appspot.com",
  messagingSenderId: "312577088891",
  appId: "1:312577088891:web:1373d6933d3c19e192f1de",
  measurementId: "G-NLZ6PGMCQK",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();

const storage = getStorage(app);

const auth = getAuth();

const provider = new GoogleAuthProvider();

export { app, db, storage, auth, provider };
