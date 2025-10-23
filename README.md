# Shopping List App

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
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── FIREBASE_SETUP.md      # Firebase setup instructions
└── SETUP.md               # General setup guide

```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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
   - Copy your Firebase configuration to `src/firebase/firebase.js`
   - See `FIREBASE_SETUP.md` for detailed instructions

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Setup

The app requires Firebase for:
- **Authentication:** User login and registration
- **Firestore:** Real-time database for lists, items, and groups
- **Security Rules:** Proper access control

See `FIREBASE_SETUP.md` for detailed configuration instructions.

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
- `SETUP.md` - General setup guide
- `FIREBASE_SETUP.md` - Firebase configuration
- Create an issue in the repository
