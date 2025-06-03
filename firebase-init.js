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

// Get references to our HTML elements (these might be undefined if firebase-init.js is loaded without auth.html)
// These elements are primarily for auth.html
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authToggle = document.getElementById('auth-toggle');
const authTitle = document.getElementById('auth-title');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn'); // For index.html

// --- AUTHENTICATION LOGIC ---

// This block handles the login/signup form interactions on auth.html
if (authToggle) { // Only add listener if element exists (i.e., on auth.html)
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
        if (authError) authError.textContent = ''; // Clear error on toggle
    });
}

if (signupForm) { // Only add listener if form exists (i.e., on auth.html)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Clear previous errors
        if (authError) authError.textContent = '';

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("User signed up:", userCredential.user.uid);
                // Redirect to index.html after successful signup
                window.location.href = './index.html'; 
            })
            .catch(err => {
                console.error("Signup error:", err);
                if (authError) authError.textContent = err.message;
            });
    });
}

if (loginForm) { // Only add listener if form exists (i.e., on auth.html)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Clear previous errors
        if (authError) authError.textContent = '';

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user.uid);
                // Redirect to index.html after successful login
                window.location.href = './index.html'; 
            })
            .catch(err => {
                console.error("Login error:", err);
                if (authError) authError.textContent = err.message;
            });
    });
}

if (logoutBtn) { // Only add listener if button exists (i.e., on index.html)
    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                console.log("User signed out.");
                window.location.href = './auth.html'; // Redirect to login page after logout
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    });
}

// Auth State Observer: This is the most important part.
// It checks if a user is logged in or out and shows/hides the correct content.
auth.onAuthStateChanged(user => {
    // Determine the current page
    const isAuthPage = window.location.pathname.endsWith('/auth.html') || window.location.pathname.endsWith('/auth');
    const isIndexPage = window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/index') || window.location.pathname === '/'; // Handles root path

    if (user) {
        // User is logged in
        if (isAuthPage) {
            // If on auth page but logged in, redirect to index.html
            window.location.href = './index.html';
        } else if (isIndexPage || window.location.pathname.endsWith('/grocery_list.html')) {
            // If on index or grocery list page and logged in, ensure app UI is initialized
            // This function is defined in index.html's script
            if (typeof initializeAppUI === 'function') {
                initializeAppUI(user);
            } else {
                console.warn("initializeAppUI function not found. Ensure index.html is loaded correctly and defines it.");
            }
        }
    } else {
        // User is logged out
        if (!isAuthPage) {
            // If not on auth page and logged out, redirect to auth.html
            window.location.href = './auth.html';
        }
        // If already on auth page and logged out, do nothing (stay on auth page)
    }
});