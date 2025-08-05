// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyARH312ZmAqXY_QtLVyraYHEvE2pFOE0yw",
//   authDomain: "nascomsoft-b438c.firebaseapp.com",
//   projectId: "nascomsoft-b438c",
//   storageBucket: "nascomsoft-b438c.firebasestorage.app",
//   messagingSenderId: "44134092323",
//   appId: "1:44134092323:web:5db2100c3ba947224deb96",
//   measurementId: "G-F0B9PSSQ6W"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app"
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  User,
} from "firebase/auth"
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey:   process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID! 
}

// Initialize the Firebase app once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

// Only set up analytics in the browser
let analytics: ReturnType<typeof getAnalytics> | undefined
if (typeof window !== "undefined") {
     analytics = getAnalytics(app)
  // Optional: check if analytics is supported on this browser
  // isSupported()
  //   .then((yes) => {
  //     if (yes) analytics = getAnalytics(app)
  //   })
  //   .catch(() => {
  //     /* analytics not supported, silently ignore */
  //   })
}

export const auth = getAuth()
export const db   = getFirestore()
export const provider = new GoogleAuthProvider();

// Helper: fetch custom claims (to detect admin)
export async function refreshUserToken(user: User) {
  return user.getIdTokenResult(true)
}


export function signInWithGooglePopup() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      console.log("User signed in:", user.displayName, user.email);
      // You can now update your UI or navigate the user
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData ? error.customData.email : 'N/A';
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error("Google Sign-in Error:", errorMessage);
      // ...
    });
}

function signInWithGoogleRedirect() {
  signInWithRedirect(auth, provider);
}

// To handle the redirect result AFTER the user comes back to your app:
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      console.log("User signed in after redirect:", user.displayName, user.email);
    }
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData ? error.customData.email : 'N/A';
    const credential = GoogleAuthProvider.credentialFromError(error);

    console.error("Google Sign-in Redirect Error:", errorMessage);
  });


// import { onAuthStateChanged } from 'firebase/auth';
//
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     console.log("Current user:", user.displayName || user.email);
//     // ...
//   } else {
//     // User is signed out
//     console.log("No user is signed in.");
//   }
// });
//
