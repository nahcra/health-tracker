// Paste your Firebase config object from Step 1 here
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Get references to our HTML elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const logoutBtn = document.getElementById('logout-btn');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authToggle = document.getElementById('auth-toggle');
const authTitle = document.getElementById('auth-title');
const authError = document.getElementById('auth-error');


// --- AUTHENTICATION LOGIC ---

// Toggle between Login and Sign Up forms
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

// Sign Up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .catch(err => {
            console.error(err);
            authError.textContent = err.message;
        });
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            console.error(err);
            authError.textContent = err.message;
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Auth State Observer: This is the most important part.
// It checks if a user is logged in or out and shows/hides the correct content.
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        authError.textContent = ''; // Clear any previous errors
        
        // Initialize the main app UI with the user's data
        initializeAppUI(user);

    } else {
        // User is logged out
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
});