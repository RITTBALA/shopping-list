# Shopping List Application

A real-time, collaborative shopping list web application built with React and Firebase.

## Features

- **User Authentication**: Register and login with email/password
- **List Management**: Create, update, archive, and delete shopping lists
- **Real-time Collaboration**: Share lists with other users and see changes in real-time
- **Item Management**: Add, check off, and delete items from lists
- **Material-UI Design**: Modern and responsive user interface

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Firebase (Authentication & Firestore)
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM

## Setup Instructions

### 1. Firebase Configuration

Before running the application, you need to set up Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project (or use an existing one)
3. Enable **Email/Password Authentication**:
   - In the Firebase Console, go to **Authentication** > **Sign-in method**
   - Enable **Email/Password** provider
4. Create a **Firestore Database**:
   - In the Firebase Console, go to **Firestore Database**
   - Click **Create database**
   - Start in **test mode** (or production mode with the rules below)
5. Get your Firebase configuration:
   - Go to **Project Settings** (gear icon) > **General**
   - Scroll down to **Your apps** section
   - Click on the **Web app** icon (</>) to register your app
   - Copy the `firebaseConfig` object

### 2. Update Firebase Configuration

Open `src/firebase/firebase.js` and replace the placeholder configuration with your actual Firebase config:

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

### 3. Set Up Firestore Security Rules

In the Firebase Console, go to **Firestore Database** > **Rules** and add the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lists collection - only members can read/write
    match /lists/{listId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      allow create: if request.auth != null && 
                       request.auth.uid in request.resource.data.members;
      allow update, delete: if request.auth != null && 
                               request.auth.uid in resource.data.members;
    }
    
    // Items collection - accessible to list members
    match /items/{itemId} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/lists/$(resource.data.listId)) &&
                     request.auth.uid in get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.members;
      allow create: if request.auth != null &&
                       exists(/databases/$(database)/documents/lists/$(request.resource.data.listId)) &&
                       request.auth.uid in get(/databases/$(database)/documents/lists/$(request.resource.data.listId)).data.members;
      allow update, delete: if request.auth != null &&
                               exists(/databases/$(database)/documents/lists/$(resource.data.listId)) &&
                               request.auth.uid in get(/databases/$(database)/documents/lists/$(resource.data.listId)).data.members;
    }
  }
}
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── ProtectedRoute.jsx
│   ├── ListCard.jsx
│   └── CreateListDialog.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── ListPage.jsx
├── firebase/           # Firebase configuration and services
│   ├── firebase.js
│   └── firestoreService.js
├── context/            # React Context providers
│   └── AuthContext.jsx
├── App.jsx             # Main app component with routing
└── main.jsx           # Entry point
```

## Data Models

### Users Collection
- `uid`: String - User's unique ID
- `email`: String - User's email
- `displayName`: String - User's display name

### Lists Collection
- `listName`: String - Name of the list
- `createdAt`: Timestamp - Creation date
- `creatorId`: String - Creator's UID
- `members`: Array<String> - Array of member UIDs
- `status`: String - "active" or "archived"
- `icon`: String - Icon name
- `color`: String - Hex color code

### Items Collection
- `itemName`: String - Item name
- `isPurchased`: Boolean - Purchase status
- `listId`: String - Parent list ID
- `addedBy`: String - UID of user who added the item

## Current Features (Sprint 1 Complete)

✅ User authentication (register/login/logout)
✅ Protected routes
✅ Dashboard with active/archived tabs
✅ Create new lists with custom icons and colors
✅ Real-time list updates
✅ Archive/unarchive lists
✅ Delete lists

## Next Steps (Sprint 2)

- [ ] Implement full ListPage with item management
- [ ] Add item creation, deletion, and purchase toggling
- [ ] Implement list sharing functionality
- [ ] Add user search by email
- [ ] Display list members
- [ ] Add item filtering and sorting

## License

MIT
