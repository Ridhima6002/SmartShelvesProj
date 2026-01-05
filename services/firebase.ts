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
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
const db = getFirestore(app);

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

/**
 * Ensure a student profile exists in Firestore under `students/{uid}`.
 */
export async function createOrUpdateStudentProfile(u: FirebaseUser) {
  try {
    const name = u.displayName || u.email?.split('@')[0] || 'User';
    const email = u.email || '';
    const avatar = u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=003366&color=fff`;

    const ref = doc(db, 'students', u.uid);
    await setDoc(ref, {
      id: u.uid,
      name,
      email,
      role: 'student',
      avatar,
      issuedBooks: [],
      fines: 0,
      bookBankPaid: false,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('createOrUpdateStudentProfile error', e);
    throw e;
  }
}

/**
 * Ensure an admin profile exists in Firestore under `admins/{uid}`.
 */
export async function createOrUpdateAdminProfile(u: FirebaseUser) {
  try {
    const name = u.displayName || u.email?.split('@')[0] || 'Admin';
    const email = u.email || '';

    const ref = doc(db, 'admins', u.uid);
    await setDoc(ref, {
      id: u.uid,
      name,
      email,
      role: 'admin',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('createOrUpdateAdminProfile error', e);
    throw e;
  }
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  // create student profile in Firestore
  try {
    await createOrUpdateStudentProfile(cred.user);
  } catch (e) {
    // ignore profile write errors
    console.warn('Failed to write student profile', e);
  }
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // ensure student profile exists/updated
  try {
    await createOrUpdateStudentProfile(cred.user);
  } catch (e) {
    console.warn('Failed to write student profile', e);
  }
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  // ensure student profile exists/updated
  try {
    await createOrUpdateStudentProfile(cred.user);
  } catch (e) {
    console.warn('Failed to write student profile', e);
  }
  return mapFirebaseUserToAppUser(cred.user);
}

export async function signOut() {
  const uid = auth.currentUser?.uid;
  await firebaseSignOut(auth);
  try {
    if (uid) localStorage.removeItem(adminCacheKey(uid));
  } catch (e) {
    // ignore
  }
}

const ADMIN_CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function adminCacheKey(uid: string) {
  return `adminCache:${uid}`;
}

function readAdminCache(uid: string) {
  try {
    const raw = localStorage.getItem(adminCacheKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { isAdmin: boolean; ts: number };
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeAdminCache(uid: string, isAdmin: boolean) {
  try {
    localStorage.setItem(adminCacheKey(uid), JSON.stringify({ isAdmin, ts: Date.now() }));
  } catch (e) {
    // ignore storage errors
  }
}

async function revalidateAdmin(u: FirebaseUser, ttlMs = ADMIN_CACHE_TTL_MS) {
  // Perform both checks in parallel and return the computed boolean
  const tokenPromise = getIdTokenResult(u);
  const docPromise = getDoc(doc(db, 'admins', u.uid));

  const [tokenRes, docRes] = await Promise.allSettled([tokenPromise, docPromise]);

  let tokenIsAdmin = false;
  if (tokenRes.status === 'fulfilled') {
    try {
      // @ts-ignore
      tokenIsAdmin = !!tokenRes.value?.claims?.admin;
    } catch (e) {
      tokenIsAdmin = false;
    }
  }

  let docIsAdmin = false;
  if (docRes.status === 'fulfilled') {
    try {
      // @ts-ignore
      docIsAdmin = !!docRes.value?.exists();
    } catch (e) {
      docIsAdmin = false;
    }
  }

  const result = tokenIsAdmin || docIsAdmin;
  writeAdminCache(u.uid, result);
  return result;
}

/**
 * Check if a Firebase user is an admin.
 * Behavior improvements:
 * - Uses a small localStorage cache for speed (default TTL: 5m)
 * - If cache is valid, returns immediately and triggers a background revalidation
 * - When no valid cache, runs token + Firestore checks in parallel
 */
export async function isUserAdmin(u: FirebaseUser, options?: { useCache?: boolean; ttlMs?: number; forceRefresh?: boolean; background?: boolean }): Promise<boolean> {
  const useCache = options?.useCache !== false;
  const ttlMs = options?.ttlMs ?? ADMIN_CACHE_TTL_MS;
  const forceRefresh = options?.forceRefresh ?? false;
  const background = options?.background !== false; // default true

  if (!u) return false;

  // Try cache first
  if (useCache && !forceRefresh) {
    const cached = readAdminCache(u.uid);
    if (cached) {
      const age = Date.now() - cached.ts;
      if (age < ttlMs) {
        // Start revalidation in background but return cached value immediately
        if (background) {
          // fire-and-forget
          revalidateAdmin(u, ttlMs).catch(() => {});
        }
        return cached.isAdmin;
      }
    }
  }

  // No valid cache -> do full parallel revalidation
  try {
    console.time(`admin-check:${u.uid}`);
    const result = await revalidateAdmin(u, ttlMs);
    console.timeEnd(`admin-check:${u.uid}`);
    return result;
  } catch (e) {
    console.timeEnd(`admin-check:${u.uid}`);
    return false;
  }
}

export function onAuthStateChanged(callback: (user: AppUser | null) => void) {
  return fbOnAuthStateChanged(auth, async (u) => {
    const mapped = mapFirebaseUserToAppUser(u);
    if (!mapped) {
      callback(null);
      return;
    }

    try {
      // Prefer fast cached response and keep revalidation in background
      const isAdmin = u ? await isUserAdmin(u, { useCache: true, background: true }) : false;
      mapped.role = isAdmin ? 'admin' : 'student';

      // Ensure Firestore profiles exist/are updated (do not block)
      if (u) {
        if (isAdmin) {
          createOrUpdateAdminProfile(u).catch(() => {});
        } else {
          createOrUpdateStudentProfile(u).catch(() => {});
        }
      }

    } catch (e) {
      // leave as student
    }

    callback(mapped);
  });
}

export { auth, db };
