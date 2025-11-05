import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminAccount() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin';

  try {
    console.log('Creating admin account...');
    
    // Create the admin user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('Admin user created in Authentication:', user.uid);

    // Create the admin user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: adminEmail,
      displayName: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lists: [],
      groups: []
    });

    console.log('Admin user document created in Firestore');
    console.log('✅ Admin account successfully created!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin account already exists');
      console.log('Email: admin@admin.com');
      console.log('Password: admin');
    } else {
      console.error('Error creating admin account:', error.message);
    }
    process.exit(1);
  }
}

createAdminAccount();
