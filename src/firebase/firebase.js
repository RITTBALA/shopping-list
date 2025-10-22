import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtRdp7_XolESibounA4_gxRVJDgzf-NqM",
  authDomain: "shopping-list-c9f40.firebaseapp.com",
  projectId: "shopping-list-c9f40",
  storageBucket: "shopping-list-c9f40.firebasestorage.app",
  messagingSenderId: "200281584693",
  appId: "1:200281584693:web:3ca7214274ea6a783c2d7c",
  measurementId: "G-6EJJRM52DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
