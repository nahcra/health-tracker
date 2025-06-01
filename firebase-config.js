// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXZgNctLWAu0haKvd90_hFAlo1WHM1n7Q",
  authDomain: "myhealthtrackerapp.firebaseapp.com",
  projectId: "myhealthtrackerapp",
  storageBucket: "myhealthtrackerapp.firebasestorage.app",
  messagingSenderId: "234509938064",
  appId: "1:234509938064:web:ab0c8e5af909b83ee99715",
  measurementId: "G-HZYD9L44TC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);