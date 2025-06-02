// workout app/firebase-init.js
// Firebase SDKs are typically loaded via script tags in HTML, but good to include here for context
// import { initializeApp } from "firebase/app"; // Not directly used here as firebase global is assumed
// import { getAuth } = "firebase/auth"; // Not directly used here as firebase global is assumed
// import { getFirestore } = "firebase/firestore"; // Not directly used here as firebase global is assumed

// Your web app's Firebase configuration - THESE HAVE BEEN UPDATED
const firebaseConfig = {
  apiKey: "AIzaSyCXZgNctLWAu0haKvd90_hFAlo1WHM1n7Q",
  authDomain: "myhealthtrackerapp.firebaseapp.com",
  projectId: "myhealthtrackerapp",
  storageBucket: "myhealthtrackerapp.firebasestorage.app",
  messagingSenderId: "234509938064",
  appId: "1:234509938064:web:ab0c8e5af909b83ee99715",
  measurementId: "G-HZYD9L44TC" // Your measurementId if you enabled Analytics
};

// Initialize Firebase (using the global 'firebase' object from SDK script tags)
if (typeof firebase !== 'undefined' && typeof firebase.app === 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else if (typeof firebase === 'undefined') {
    console.error("Firebase SDKs not loaded. Please check script tags in HTML.");
}


// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore(); // Ensure firestore is initialized if you're using db

// Get references to our HTML elements (these might be undefined if firebase-init.js is loaded without index.html)
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const logoutBtn = document.getElementById('logout-btn');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authToggle = document.getElementById('auth-toggle');
const authTitle = document.getElementById('auth-title');
const authError = document.getElementById('auth-error');


// --- AUTHENTICATION LOGIC ---

// This entire block might only be relevant if firebase-init.js is included in auth.html
// However, the current setup implies it's also loaded in index.html, so it's placed here.

if (authToggle) { // Only add listener if element exists
    authToggle.addEventListener('click', () => {
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');

        if (signupForm.classList.contains('hidden')) {
            authTitle.textContent = 'Login';
            authToggle.textContent = 'Need an account? Sign Up';
        } else {
            authTitle.textContent = 'Sign Up';
            authToggle.textContent = 'Have an account? Login';
        }
    });
}

if (signupForm) { // Only add listener if form exists
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("User signed up:", userCredential.user.uid);
                // Redirect to index.html after successful signup
                window.location.href = './index.html'; 
            })
            .catch(err => {
                console.error(err);
                if (authError) authError.textContent = err.message;
            });
    });
}

if (loginForm) { // Only add listener if form exists
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user.uid);
                // Redirect to index.html after successful login
                window.location.href = './index.html'; 
            })
            .catch(err => {
                console.error(err);
                if (authError) authError.textContent = err.message;
            });
    });
}

if (logoutBtn) { // Only add listener if button exists
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });
}

// Auth State Observer: This is the most important part.
// It checks if a user is logged in or out and shows/hides the correct content.
auth.onAuthStateChanged(user => {
    if (authContainer && appContainer) { // Ensure these elements exist before manipulating
        if (user) {
            // User is logged in
            authContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            if (authError) authError.textContent = ''; // Clear any previous errors
            
            // Initialize the main app UI with the user's data
            // This function is defined in main.js
            if (typeof initializeAppUI === 'function') {
                initializeAppUI(user);
            } else {
                console.warn("initializeAppUI function not found. Ensure main.js is loaded correctly.");
            }

        } else {
            // User is logged out
            authContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
            // Redirect to auth.html if logged out and not already there
            if (!window.location.pathname.endsWith('/auth.html')) {
                 window.location.href = './auth.html'; // This will redirect to auth.html if the user is not logged in
            }
        }
    }
});