// scripts/setAdminClaim.js
const admin = require('firebase-admin');
const path = require('path');

const keyPath = path.resolve(__dirname, '../serviceAccountKey.json'); // adjust if you save elsewhere
const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdmin(uidOrEmail) {
  if (!uidOrEmail) {
    console.error('Usage: node scripts/setAdminClaim.js <uid|email>');
    process.exit(1);
  }

  let uid = uidOrEmail;
  try {
    if (uidOrEmail.includes('@')) {
      const userRecord = await admin.auth().getUserByEmail(uidOrEmail);
      uid = userRecord.uid;
    }

    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Admin claim set for UID: ${uid}`);

    // Ensure an admins/{uid} doc exists in Firestore for quick lookups and metadata
    try {
      const userRecord = await admin.auth().getUser(uid);
      await admin.firestore().doc(`admins/${uid}`).set({
        id: uid,
        email: userRecord.email || null,
        name: userRecord.displayName || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      console.log(`✅ Admin Firestore doc created/updated for UID: ${uid}`);
    } catch (e) {
      console.warn('Could not create admin Firestore doc', e);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setAdmin(process.argv[2]);