import { supabase } from '../services/supabase';
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { User as AppUser } from '../types';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
// GOOGLE SIGN-IN
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);

  // Optional: upsert to Supabase as we do for email
  if (cred.user) {
    await upsertUserToSupabase(cred.user);
  }

  return mapFirebaseUserToAppUser(cred.user);
}
// ---------------------- SUPABASE SYNC FUNCTION ----------------------
async function upsertUserToSupabase(u: FirebaseUser) {
  const { uid, email, displayName } = u;
  const { error } = await supabase.from('students').upsert({
    firebase_uid: uid,
    email: email,
    name: displayName || email?.split('@')[0],
    created_at: new Date(),
    last_sign_in: new Date(),           // every login updates this
  });
  if (error) console.error('Supabase upsert error:', error);
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
    // Upsert to Supabase
  if (cred.user) await upsertUserToSupabase(cred.user);
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
   // Upsert to Supabase (in case user row missing)
  if (cred.user) await upsertUserToSupabase(cred.user);
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: AppUser | null) => void) {
  return fbOnAuthStateChanged(auth, async (u) => {
    if (u) await upsertUserToSupabase(u); // make sure row exists
    callback(mapFirebaseUserToAppUser(u));
  });
}
export { auth };
