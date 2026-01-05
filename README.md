<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10rIyNbfIQkOKbjJ7wyGzzcGoVpXToeW8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase Authentication (optional)

To enable user authentication with Firebase:

1. Create a Firebase project at https://console.firebase.google.com
2. In Firebase Console → Authentication → Sign-in Method, enable **Email/Password**.
3. Copy your Firebase config values into `.env.local` using `.env.local.example` as a template. The app expects variables prefixed with `VITE_` (e.g., `VITE_FIREBASE_API_KEY`).
4. Restart the dev server after adding `.env.local`.

We use the modular Firebase SDK; sign-in and sign-up are handled in `components/AuthModal.tsx` and the Firebase initialization is in `services/firebase.ts`.
