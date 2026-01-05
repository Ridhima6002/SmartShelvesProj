import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { User as AppUser } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function mapFirebaseUserToAppUser(u: FirebaseUser | null): AppUser | null {
  if (!u) return null;
  const name = u.displayName || u.email?.split('@')[0] || 'User';
  const email = u.email || '';
  const avatar = u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=003366&color=fff`;

  const appUser: AppUser = {
    id: u.uid,
    name,
    email,
    role: 'student',
    avatar,
    issuedBooks: [],
    fines: 0,
    bookBankPaid: false,
  };

  return appUser;
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: AppUser | null) => void) {
  return fbOnAuthStateChanged(auth, (u) => callback(mapFirebaseUserToAppUser(u)));
}

export { auth };
