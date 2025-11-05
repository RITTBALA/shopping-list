# Quick Firebase Setup Guide

## 🔥 You need to configure Firebase before you can create accounts!

### Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Name your project (e.g., "shopping-list-app")
4. Click Continue through the setup steps
5. Click "Create project"

### Step 2: Enable Email/Password Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started" if it's your first time
3. Click on the "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle the first switch to **Enable**
6. Click "Save"

### Step 3: Create Firestore Database

1. In the left sidebar, click "Firestore Database"
2. Click "Create database"
3. Select **"Start in test mode"** (for development)
4. Choose a location (or leave default)
5. Click "Enable"

### Step 4: Get Your Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview" in the left sidebar
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Give your app a nickname (e.g., "Shopping List Web")
6. Click "Register app"
7. **Copy the firebaseConfig object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 5: Update Your Code

1. Open `src/firebase/firebase.js`
2. Replace this section:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your actual config from Step 4.

### Step 6: Set Up Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    // Helper function to check if a user is an admin via a custom claim
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'admin@admin.com';
      return request.auth.token.admin === true;
    }
    

    // A user can read their own data, or an admin can.
    // A user can only create/update their own document.
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || isAdmin());
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if request.auth.uid == userId;
      allow delete: if isAdmin(); // Admin can delete any user
    }
    

    // Rules for the 'lists' collection
    match /lists/{listId} {
      allow read: if request.auth != null && 
                     (request.auth.uid in resource.data.members || isAdmin());
      allow create: if request.auth != null && 
                       request.auth.uid in request.resource.data.members;
      allow update: if request.auth != null && 
                       (request.auth.uid in resource.data.members || isAdmin());
      allow delete: if request.auth != null && 
                       (request.auth.uid in resource.data.members || isAdmin());
      // A user must be a member of a list to interact with it.
      function isListMember() {
        return request.auth.uid in resource.data.members;
      }

      allow read, update, delete: if isListMember() || isAdmin();
      // On create, the creator must be listed as a member.
      allow create: if request.auth.uid in request.resource.data.members;

      // Nest items within the list for better security.
      // Now, these rules only apply if the user can access the parent list.
      match /items/{itemId} {
        allow read, write, delete: if isListMember() || isAdmin();
      }
    }
    
    match /items/{itemId} {
      allow read, write: if request.auth != null;
      allow delete: if request.auth != null || isAdmin();
    }
  }
}
```

4. Click "Publish"

### Step 7: Test Your App

1. Save all files
2. Refresh your browser at http://localhost:5173/
3. Try creating an account!

## 🐛 Troubleshooting

**If you see errors in the browser console:**

- `Firebase: Error (auth/invalid-api-key)` → Your Firebase config is wrong
- `Firebase: Error (auth/network-request-failed)` → Check your internet connection
- `Firebase: Error (auth/operation-not-allowed)` → Email/Password auth is not enabled in Firebase Console
- Any other error → Open the browser console (F12) and share the error message

**Check your browser console (F12) for detailed error messages!**
