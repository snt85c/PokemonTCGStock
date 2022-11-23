// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBSkqw1FEZfnhO-9vlyKpkRy_pDn-uUks",

  authDomain: "tcg-stock-app.firebaseapp.com",

  projectId: "tcg-stock-app",

  storageBucket: "tcg-stock-app.appspot.com",

  messagingSenderId: "202041862043",

  appId: "1:202041862043:web:87d3e52e0e054f33c7a33e",

  measurementId: "G-7ZKFGPTVVM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
