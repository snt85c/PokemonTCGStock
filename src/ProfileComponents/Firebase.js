// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwUdqeI2UXssqhGhzMxs3wUQ6eZe4r-D0",
  authDomain: "pokemontcgstock.firebaseapp.com",
  projectId: "pokemontcgstock",
  storageBucket: "pokemontcgstock.appspot.com",
  messagingSenderId: "249446388726",
  appId: "1:249446388726:web:c899d21e6885d7edba2dd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);