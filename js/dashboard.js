import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { auth, db, provider } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.getElementById("sign-out-btn");
  if (signOutBtn != null) {
    signOutBtn.addEventListener("click", async () => {
      await signOut(auth);
      alert("Signed out successfully!");
      window.location.href = getCurrentLink() + "/index.html";
    });
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const username = userData.username;

    document.getElementById("username-display").innerText = username;
    document.getElementById("user-uid").innerText = `${uid}`;
  } else {
    alert("You must be signed in to view this page!");
    window.location.href = getCurrentLink() + "/signin.html";
  }
});
