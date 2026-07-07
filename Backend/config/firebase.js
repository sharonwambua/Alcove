const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config();


if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log(" Alcove Core Status: Firebase Admin SDK Initialized Cleanly!");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error.message);
  }
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };