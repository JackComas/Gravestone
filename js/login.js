import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { auth, db, provider } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const googleBtn = document.getElementById("google-sign-in");
  if (!form) return console.log("No form");

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const username = user.displayName;
      const email = user.email;
      console.log(user, username, email);

      setDoc(
        doc(db, "users", user.uid),
        {
          username: username,
          email: email,
        },
        { merge: true },
      );

      setDoc(
        doc(db, "users", user.uid),
        {
          lastOnline: serverTimestamp(),
        },
        { merge: true },
      );
      window.location.href = getCurrentLink() + "/index.html";
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(userCredentials);
      const { user } = userCredentials;
      form.reset();
      alert("Logged In Successfully!");
      window.location.href = `${getCurrentLink()}/index.html`;
    } catch (error) {
      console.log("loi dang ki", error);
      let message = "dki that bai";
      if (error.code == "auth/invalid-email") {
        message = "Invalid Email";
      }
      alert(message);
    }
  });
});

function getCurrentLink() {
  let text = window.location.href;
  const URLParts = text.split("/");
  const isHTML = URLParts[URLParts.length - 1].includes(".html");

  let returnVar = "";
  if (isHTML) {
    let returnVar = URLParts.slice(0, URLParts.length - 1).join("/");
  } else {
    let returnVar = URLParts.join("/");
  }
  if (returnVar[returnVar.length - 1] == "/") {
    return returnVar.slice(0, returnVar.length - 1);
  } else {
    return returnVar;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    alert("You are already signed in!");
    window.location.href = `${getCurrentLink()}/index.html`;
  }
});
