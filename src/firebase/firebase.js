import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtB54Z4ocRvRZ4-mMQiI29kBjU8D1GUgY",
  authDomain: "easyshopping-list.firebaseapp.com",
  projectId: "easyshopping-list",
  storageBucket: "easyshopping-list.firebasestorage.app",
  messagingSenderId: "972197540912",
  appId: "1:972197540912:web:8f463aebfcbf64512329f5",
  measurementId: "G-5QV0THWNTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
