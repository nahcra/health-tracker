78% of storage used … If you run out of space, you can't save to Drive or back up Google Photos.
// workout app/firebase-init.js
// Firebase SDKs are typically loaded via script tags in HTML, but good to include here for context
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXZgNctLWAu0haKvd90_hFAlo1WHM1n7Q",
  authDomain: "myhealthtrackerapp.firebaseapp.com",
  projectId: "myhealthtrackerapp",
  storageBucket: "myhealthtrackerapp.firebasestorage.app",
  messagingSenderId: "234509938064",
  appId: "1:234509938064:web:ab0c8e5af909b83ee99715",
  measurementId: "G-HZYD9L44TC" // Your measurementId if you enabled Analytics
};

// Initialize Firebase App
let app;
if (typeof firebase !== 'undefined' && typeof firebase.app === 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
} else if (typeof firebase !== 'undefined' && typeof firebase.app !== 'undefined') {
    // If firebase.app is already defined, it means an app might have been initialized.
    // Try to get the default app, or re-initialize if necessary (though this path is less common)
    try {
        app = firebase.app();
    } catch (e) {
        app = firebase.initializeApp(firebaseConfig);
    }
} else {
    console.error("Firebase SDKs not loaded. Please check script tags in HTML.");
}

// Get references to Firebase services and make them globally accessible
// These are declared with `var` or no keyword to ensure they are truly global
// and can be accessed by scripts in index.html and grocery_list.html
var auth = firebase.auth();
var db = firebase.firestore();

// Get references to our HTML elements (these might be undefined if firebase-init.js is loaded without auth.html)
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
// It checks if a user is logged in or out and sets a global variable.
// The actual UI initialization will be handled by the DOMContentLoaded listener in index.html
auth.onAuthStateChanged(user => {
    // Expose the user object globally
    window.currentUser = user;

    // Determine the current page
    const isAuthPage = window.location.pathname.endsWith('/auth.html') || window.location.pathname.endsWith('/auth');
    const isIndexPage = window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/index') || window.location.pathname === '/'; // Handles root path
    const isGroceryPage = window.location.pathname.endsWith('/grocery_list.html');

    if (user) {
        // User is logged in
        if (isAuthPage) {
            // If on auth page but logged in, redirect to index.html
            window.location.href = './index.html';
        } 
        // For index.html and grocery_list.html, the DOMContentLoaded listener will pick up window.currentUser
        // and call initializeAppUI
    } else {
        // User is logged out
        if (!isAuthPage) {
            // If not on auth page and logged out, redirect to auth.html
            window.location.href = './auth.html';
        }
        // If already on auth page and logged out, do nothing (stay on auth page)
    }
});