// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_oosrhMrq4oEHsJXy_lYm9gKOHETbNPM",
  authDomain: "syntaxsurfers-hackathon.firebaseapp.com",
  projectId: "syntaxsurfers-hackathon",
  storageBucket: "syntaxsurfers-hackathon.firebasestorage.app",
  messagingSenderId: "560851073910",
  appId: "1:560851073910:web:a454769b4be0f8dbb79857",
  measurementId: "G-W2X4MWG7H6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
