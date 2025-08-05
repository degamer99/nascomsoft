// stores/useUserStore.ts
import {create} from "zustand"
import { auth, refreshUserToken, db, signInWithGooglePopup} from "@/store/firebase"
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User
} from "firebase/auth"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"

interface UserState {
  user: User | null
  admin: boolean
  loading: boolean
  signUp: (email: string, pw: string) => Promise<void>
  signIn: (email: string, pw: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

type UserState = {
  user: User | null;
  loading: boolean;
};

export const useUserStore = create<UserState>((set) => {
  // 1️⃣ Listen once, globally, for auth state changes
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      // fetch custom claims to see if they’re an admin
      const token = await refreshUserToken(fbUser)
      set({ user: fbUser, admin: !!token.claims.admin, loading: false })
      console.log(fbUser)
    } else {
      set({ user: null, admin: false, loading: false })
      console.log(fbUser)
    }
  })

  return {
    user: null,
    admin: false,
    loading: true,

    // 2️⃣ Sign Up — creates a Firebase Auth user and a Firestore profile
    signUp: async (email, pw) => {
      const cred = await createUserWithEmailAndPassword(auth, email, pw)
      await setDoc(doc(db, "profiles", cred.user.uid), {
        email,
        createdAt: serverTimestamp(),
      })
    },

    // 3️⃣ Sign In
    signIn: (email, pw) => signInWithEmailAndPassword(auth, email, pw),


    // 3️⃣ Sign Inwith Google
    signInWithGoogle: () => signInWithGooglePopup(),

    // 4️⃣ Sign Out
    signOut: () => fbsignOut(auth).then(() => {
        console.log("User signed out successfully."); // Sign-out successful. Update your UI accordingly.
      }).catch((error) => {
        console.error("Sign-out Error:", error);
      }),
  }
})
