
---

## **Project Specification: Collaborative Shopping List Application**

### **1. Objective**

To provide a real-time, collaborative web application allowing users to create, manage, and share shopping lists with others, featuring user accounts, group management, item details (including quantity), theming, and administrative oversight.

---

### **2. Technology Stack**

* **Frontend:** React (v19, bootstrapped with Vite)
* **Build Tool:** Vite (v7) with fast HMR and optimized production builds
* **UI Library:** Material-UI (MUI v7) with Emotion for styling
* **Routing:** `react-router-dom` (v7)
* **Backend & Database:** Firebase (Backend-as-a-Service)
    * Firebase Authentication (Email/Password)
    * Firestore Database (NoSQL)
* **State Management:** 
    * React Context API (`AuthContext`, `ThemeContext`)
    * Custom Hooks (`useUserPreferences`) for user settings management
* **Deployment:** Firebase Hosting with GitHub Actions CI/CD

---

### **3. Core User Features**

#### **3.1 User Authentication & Settings**
* **Registration:** Users can create an account using an email address and password.
* **Login:** Registered users can log in using their email and password.
* **Password Visibility:** Login and Register forms include an 'eye' icon to toggle password visibility.
* **Global Auth State:** User authentication status and user data are managed globally via `AuthContext`.
* **Protected Routes:** Core application pages (`/dashboard`, `/list/:listId`, `/groups`, `/settings`) require authentication; unauthenticated users are redirected to `/login`.
* **User Settings (`/settings`):**
    * **Change Password:** Users can update their password with re-authentication.
    * **Navigation App Preference:** Choose between Google Maps or Waze for navigation. Saved to user's Firestore document and syncs across devices.
    * **Delete Account:** Users can permanently delete their account with confirmation.
    * **Logout:** Users can log out via the Settings page.

#### **3.2 List Management**
* **Create List:**
    * Users can create new shopping lists via a dialog accessible from the Dashboard.
    * Requires `listName`, selection of an `icon`, and a `color` from a modern palette (12 options).
    * Optional `location` field for store address or shopping destination.
    * Option to share immediately with "Just Me," selected individuals (by email), or a pre-defined User Group.
* **View Lists (Dashboard):**
    * Displays lists in a responsive grid (1-4 columns based on screen size).
    * **Tabs:** Separates lists into "Active" and "Archived" views.
    * **List Cards:** Show `listName`, `icon` (with themed background tint), member count, creation date, location (if set), and list `color` background. Cards have hover effects and navigation button if location is set.
* **Edit List:**
    * Accessible via an edit button on the List Card or List Header.
    * Allows changing the `listName`, list `color`, and `location`.
* **Navigate to Location:**
    * If a list has a `location` set, a map icon button appears on the List Card and List Header.
    * Opens the user's preferred navigation app (Google Maps or Waze) with directions to the location.
    * Preference is saved per user account in Firestore.
* **Archive/Unarchive List:**
    * Lists can be marked as "archived" (sets `isArchived: true`, `status: 'archived'`).
    * Archived lists appear under the "Archived" tab.
    * Lists can be unarchived (reactivated) from the "Archived" tab via the menu.
* **Delete List:**
    * Accessible via a delete button on the List Card or menu.
    * Triggers a **cascade delete**: all items associated with the list (`items` collection) are automatically deleted via a client-side batch write before the list document itself is deleted. Includes a confirmation prompt.

#### **3.3 Item Management (Within a List View - `/list/:listId`)**
* **Add Item:**
    * Form at the top of the list view.
    * Fields for `itemName` (required), `quantity`/`portions` (optional, text input for flexible portion descriptions like "2kg", "3 bottles"), `category` (optional, dropdown with categories like Produce, Dairy, Meat, etc.), and `group` (optional, for organizing items).
* **View Items:**
    * Items displayed in a list format with category grouping.
    * Shows `itemName` prominently with category color coding.
    * Displays `portions` and other details below the name if provided.
    * **Real-time Updates:** Item additions, deletions, and status changes reflect instantly for all members viewing the list.
* **Mark as Purchased:**
    * Clicking an item's checkbox or the item itself toggles its `isPurchased` status.
    * Purchased items are visually distinct (strikethrough) and automatically move to a separate "Purchased" section at the bottom of the list.
* **Edit Item:**
    * Accessible via an edit icon on each item row.
    * Opens a dialog allowing modification of `itemName`, `portions`, `category`, and `group`.
* **Delete Item:**
    * Accessible via a delete icon (red) on each item row.

#### **3.4 Collaboration & Sharing**
* **Share with Individuals:**
    * Users can share a list by entering another registered user's email address in the "Share" dialog.
    * The system finds the user's `uid` and adds it to the list's `members` array (`arrayUnion`).
* **View Members:** The "Share" dialog displays a list of all current members' emails.
* **Remove Members:**
    * Users can remove other members (except the original creator and members added via a linked group) from the "Share" dialog (`arrayRemove`).

#### **3.5 User Groups**
* **Create Group:** Users can create named groups (e.g., "Family") via the `/groups` page or Dashboard. The creator is the owner and initial member.
* **Manage Groups:**
    * Accessible via `/groups` page (linked from Dashboard SpeedDial).
    * Displays owned groups in cards.
    * Clicking a group card opens the edit modal.
* **Edit Group:** Add/remove members (by email lookup) and rename the group via `GroupModal`. The owner cannot be removed.
* **Delete Group:** Owners can delete groups they created.
* **Create List with Group:** When creating a list, users can select one of their groups to automatically populate the initial `members` array.
* **Linked Lists:**
    * Lists created with a group store a `linkedGroupId`.
    * On linked lists, the "Share" button becomes "Manage Group," opening the `GroupModal` for the linked group.
    * Members originating from the linked group cannot be individually removed from the list unless the list is unlinked.
    * An "Unlink from Group" option is available in the Share/Manage dialog.
    * **Fan-Out Sync:** When a group's members are updated, the changes are automatically propagated (via client-side batch write) to the `members` array of all lists linked to that group.

#### **3.6 List Export**
* **Export Button:** Located in the `ListHeader` on the item view page (`/list/:listId`).
* **Functionality:** Generates and downloads a well-formatted `.txt` file containing:
    * List Name
    * Separate sections for "TO BUY" (unpurchased) and "PURCHASED" items.
    * Item details including quantity and unit.
    * Total item count and export timestamp.

---

### **4. UI/UX Features**

* **Responsive Design:** The application layout adapts smoothly to different screen sizes (mobile, tablet, desktop) using MUI's breakpoint system.
* **Theme Switching:**
    * A floating action button (SpeedDial on Dashboard) opens a theme picker modal.
    * Provides 6 distinct color theme options (Purple Dream, Ocean Blue, Sunset Orange, Forest Green, Rose Pink, Midnight Blue).
    * **Dark Mode:** The "Midnight Blue" theme functions as a full dark theme with appropriate background and text colors.
    * **Persistence:** Selected theme is saved in `localStorage` and persists across sessions.
* **Modern UI Aesthetic:** Utilizes gradients, glass-morphism effects (on cards/headers in some themes), rounded corners, subtle shadows, hover animations, and emojis for a polished look.
* **Component Styling:** Uses MUI's `sx` prop for component-level styling and theme integration. Global styles (`index.css`) handle base resets and focus outline behavior.
* **User Feedback:** Includes loading spinners, confirmation dialogs (e.g., for deletion), and alert messages for errors or success notifications.
* **Accessibility:** Includes `aria-label` attributes on interactive elements like tabs; custom focus-visible styles maintain keyboard navigation cues while removing intrusive outlines from mouse clicks.

---

### **5. Admin Features**

* **Dedicated Admin Portal:** Accessible only to the user with email `admin@admin.com` at the `/admin` route. Admin is redirected here automatically upon login.
* **Distinct UI:** Features a unique dark/professional theme to differentiate from the user-facing application. No access to the regular user dashboard.
* **User Overview:** Displays a list of all registered users (excluding the admin account), showing their email and the number of lists they've created or are members of. Includes total user count.
* **List Overview:** Displays a list of *all* shopping lists in the system (belonging to non-deleted users), showing list name, creator email, member count (clickable to view members in a dialog), status (active/archived). Includes total active/archived list counts.
* **User Management:**
    * **Delete User Dialog:** Professional Material-UI dialog with warning, detailed explanation of consequences, and confirmation buttons.
    * Ability to "delete" a user. This marks the user document in Firestore as `deleted: true` (does *not* delete Firebase Auth account).
    * Marked users are prevented from logging in (`AuthContext` check).
    * Deleting a user intelligently handles their lists: deletes lists where they are the sole member, transfers ownership if they were the creator of a shared list, and removes them from the `members` array of other lists.
    * **Success/Error Notifications:** Material-UI Snackbar with styled alerts provides clear feedback on operations.
* **List Management:** Ability to delete any list directly from the admin panel (triggers cascade delete of items).
* **Security:** Admin actions are enforced via Firestore Security Rules (`isAdmin()` function checks `request.auth.token.email`).

---

### **6. Data Models (Firestore)**

* **`users`:** Stores user profile information (email, displayName, `deleted` flag, `preferences` object with `navigationApp`). Doc ID = Firebase Auth `uid`.
* **`lists`:** Stores list details (listName, icon, color, location, creatorId, members array, status, isArchived, `linkedGroupId`). Auto-generated Doc ID.
* **`items`:** Stores item details (itemName, isPurchased, listId, addedBy, portions, category, group). Auto-generated Doc ID.
* **`groups`:** Stores user group definitions (groupName, ownerId, memberUids array). Auto-generated Doc ID.

---

### **7. Project Structure & Organization**

```
shopping-list/
├── docs/                          # All documentation files
│   ├── SPECIFICATION.md           # This file - project specification
│   ├── FIREBASE_SETUP.md          # Firebase configuration guide
│   ├── SETUP.md                   # General setup instructions
│   ├── GITHUB_SECRETS_SETUP.md    # CI/CD secrets configuration
│   └── AI_DOC.md                  # AI development documentation
├── src/
│   ├── components/                # Reusable React components
│   ├── pages/                     # Route-level page components
│   ├── context/                   # React Context providers
│   ├── hooks/                     # Custom React hooks
│   ├── firebase/                  # Firebase configuration and services
│   └── assets/                    # Images, icons, static files
├── scripts/                       # Utility scripts (e.g., createAdmin.js)
├── public/                        # Public static assets
├── .github/workflows/             # GitHub Actions CI/CD pipelines
└── [config files]                 # Vite, ESLint, Firebase configs
```

**Key Design Patterns:**
* **Component Composition:** Modular, reusable components with clear responsibilities
* **Context API:** Global state management for auth and theme
* **Custom Hooks:** Encapsulated logic (e.g., `useUserPreferences`) for reusability
* **Service Layer:** `firestoreService.js` centralizes all Firestore operations
* **Protected Routes:** `ProtectedRoute` component guards authenticated pages
* **Real-time Subscriptions:** Firestore `onSnapshot` for live data updates

---

### **8. Deployment & Access**

* **Platform:** Web Application.
* **Production Deployment:** Deployed to Firebase Hosting with automatic deployment via GitHub Actions on push to `main` branch.
* **Live URL:** `https://easyshopping-list.web.app`
* **CI/CD Pipeline:** 
    * GitHub Actions workflow automatically builds and deploys on commits to main.
    * Pull request preview deployments for testing before merge.
* **Development Access:** 
    * Can be run locally with `npm run dev` using Vite dev server.
    * Accessible on local network (e.g., from a phone) with the `--host` flag (enabled by default).
    * Hot Module Replacement (HMR) for instant updates during development.
* **Environment Configuration:** Uses environment variables (`.env` file) for Firebase configuration, supporting different environments (dev/prod).