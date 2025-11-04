# Setting Up GitHub Secrets for Firebase Deployment

To deploy this project on GitHub while keeping your API keys secure, you need to add your Firebase configuration as GitHub Secrets.

## Steps:

1. Go to your GitHub repository: https://github.com/RITTBALA/shopping-list

2. Click on **Settings** → **Secrets and variables** → **Actions**

3. Click on **New repository secret** and add each of the following secrets:

### Required Secrets:

- **VITE_FIREBASE_API_KEY**
  - Value: `AIzaSyBtB54Z4ocRvRZ4-mMQiI29kBjU8D1GUgY`

- **VITE_FIREBASE_AUTH_DOMAIN**
  - Value: `easyshopping-list.firebaseapp.com`

- **VITE_FIREBASE_PROJECT_ID**
  - Value: `easyshopping-list`

- **VITE_FIREBASE_STORAGE_BUCKET**
  - Value: `easyshopping-list.firebasestorage.app`

- **VITE_FIREBASE_MESSAGING_SENDER_ID**
  - Value: `972197540912`

- **VITE_FIREBASE_APP_ID**
  - Value: `1:972197540912:web:8f463aebfcbf64512329f5`

- **VITE_FIREBASE_MEASUREMENT_ID**
  - Value: `G-5QV0THWNTP`

## After Adding Secrets:

Once all secrets are added, GitHub Actions will automatically:
- Build your project using the environment variables from secrets
- Deploy to Firebase Hosting when you push to the `main` branch
- Create preview deployments for pull requests

## Note:

Your `.env` file is already in `.gitignore` so it won't be pushed to GitHub. The secrets are securely stored in GitHub and only accessible during the build process.

