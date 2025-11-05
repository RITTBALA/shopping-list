# Shopping List App

🌐 **Live Demo:** [https://easyshopping-list.web.app](https://easyshopping-list.web.app)

A modern, collaborative shopping list application built with React, Firebase, and Material-UI. Create, share, and manage shopping lists with your family and friends in real-time.

## Features

### 🛒 Smart Shopping Lists
- Create and manage multiple shopping lists
- Add items with portions, categories, and groups
- Check off items as you shop
- Export lists to text format
- Rename and delete lists with confirmation dialogs

### 👥 Collaboration
- Share lists with other users
- Real-time synchronization across devices
- Group management for organizing shared lists
- Invite users by email

### 🎨 User Experience
- Dark/Light theme support with system preference detection
- Responsive Material-UI design
- Intuitive drag-and-drop interface
- Color-coded categories and groups
- Search and filter capabilities

### 🔐 Authentication & Security
- Firebase Authentication (Email/Password)
- Protected routes
- User profile management
- Admin features for user management

### ⚙️ Customization
- Customizable item categories
- Color themes per category
- Group color coding
- Personalized settings

## Tech Stack

- **Frontend Framework:** React 19 with Hooks
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) v7
- **Backend:** Firebase (Firestore + Authentication)
- **Routing:** React Router v7
- **State Management:** React Context API
- **Styling:** Emotion (CSS-in-JS)

## Project Structure

```
shopping-list/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # React components
│   │   ├── AddItemForm.jsx          # Form to add new items
│   │   ├── AdminRedirect.jsx        # Admin role redirect logic
│   │   ├── CreateListDialog.jsx     # Dialog for creating new lists
│   │   ├── GroupCard.jsx            # Display group information
│   │   ├── GroupModal.jsx           # Modal for group management
│   │   ├── GroupPicker.jsx          # Group selection component
│   │   ├── Item.jsx                 # Individual shopping list item
│   │   ├── ItemList.jsx             # List of shopping items
│   │   ├── ListCard.jsx             # Shopping list card display
│   │   ├── ListHeader.jsx           # List page header with actions
│   │   ├── LoginForm.jsx            # Login form component
│   │   ├── ProtectedRoute.jsx       # Route authentication wrapper
│   │   ├── RegisterForm.jsx         # User registration form
│   │   ├── RenameListDialog.jsx     # Dialog for renaming lists
│   │   ├── ShareListDialog.jsx      # Dialog for sharing lists
│   │   └── ThemeSwitcher.jsx        # Dark/Light theme toggle
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx          # Authentication state
│   │   └── ThemeContext.jsx         # Theme state and preferences
│   ├── firebase/          # Firebase configuration and services
│   │   ├── firebase.js              # Firebase initialization
│   │   └── firestoreService.js      # Firestore database operations
│   ├── pages/             # Page components
│   │   ├── AdminPage.jsx            # Admin dashboard
│   │   ├── DashboardPage.jsx        # Main user dashboard
│   │   ├── GroupsPage.jsx           # Groups management page
│   │   ├── ListPage.jsx             # Individual list view
│   │   ├── LoginPage.jsx            # Login/Register page
│   │   └── SettingsPage.jsx         # User settings
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main App component with routing
│   ├── index.css          # Base CSS
│   └── main.jsx           # Application entry point
├── docs/                  # Documentation files
│   ├── FIREBASE_SETUP.md          # Firebase setup instructions
│   ├── SETUP.md                   # General setup guide
│   ├── SPECIFICATION.md           # Project specification
│   ├── AI_DOC.md                  # AI development documentation
│   ├── GITHUB_SECRETS_SETUP.md    # GitHub secrets configuration
│   ├── Shopping List with AI.docx # Project documentation (Word)
│   └── Shopping List with AI.pdf  # Project documentation (PDF)
├── scripts/               # Utility scripts
│   └── createAdmin.js             # Admin account creation script
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration

```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Firebase CLI (for deployment) - `npm install -g firebase-tools`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RITTBALA/shopping-list.git
cd shopping-list
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add your Firebase configuration (see Deployment options below)
   - See `docs/FIREBASE_SETUP.md` for detailed instructions

4. Choose your deployment option:
   - **For Production:** See [Deploy to Firebase Hosting](#option-1-deploy-to-firebase-hosting-recommended)
   - **For Development:** See [Run Locally](#option-2-run-locally)

### Available Scripts

- `npm run dev` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run create-admin` - Create admin account (admin@admin.com / admin)

## Deployment

### Option 1: Deploy to Firebase Hosting (Recommended)

The app is configured for automatic deployment to Firebase Hosting.

**Initial Setup:**

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project (if not already done):
```bash
firebase init hosting
```
   - Select your Firebase project
   - Set `dist` as your public directory
   - Configure as a single-page app: Yes
   - Don't overwrite existing files

4. Build and deploy:
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

**Automatic Deployment with GitHub Actions:**

This project includes GitHub Actions workflows for automatic deployment:
- Push to `main` branch → automatic deployment to production
- Pull requests → preview deployments for testing

See `docs/GITHUB_SECRETS_SETUP.md` for configuring GitHub secrets.

### Option 2: Run Locally

For local development and testing:

1. Create a `.env` file in the root directory with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser at `http://localhost:5173`

The local server includes:
- Hot Module Replacement (HMR) for instant updates
- Host access for testing on mobile devices on the same network
- Full Firebase functionality

## Firebase Setup

The app requires Firebase for:
- **Authentication:** User login and registration
- **Firestore:** Real-time database for lists, items, and groups
- **Security Rules:** Proper access control

See `docs/FIREBASE_SETUP.md` for detailed configuration instructions.

## Key Features Explained

### Shopping Lists
- Create unlimited lists
- Add items with optional portions (e.g., "2kg", "3 bottles")
- Categorize items (Produce, Dairy, Meat, etc.)
- Assign items to groups
- Export lists as formatted text

### Groups
- Create groups to organize shared lists
- Invite members by email
- Color-code groups for easy identification
- Manage group membership

### Theming
- Automatic dark/light mode based on system preferences
- Manual theme toggle
- Persistent theme selection
- Material-UI theming with custom color palettes

### Admin Features
- View all users
- Manage user roles
- System monitoring

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is private and for educational purposes.

## Support

For setup issues or questions, refer to:
- `docs/SETUP.md` - General setup guide
- `docs/FIREBASE_SETUP.md` - Firebase configuration
- Create an issue in the repository
