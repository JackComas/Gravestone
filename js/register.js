import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { auth, db, provider } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  if (!form) return console.log("No form");
  const googleBtn = document.getElementById("google-sign-up");

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const email = result.user.email;
      setDoc(doc(db, "users", user.uid), {
        username: email,
        email: email,
        createdAt: serverTimestamp(),
        isAdmin: false,
      });
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      // 1. Tạo user
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const { user } = userCredentials;
      // 2. Update display name
      await updateProfile(user, {
        displayName: username,
      });

      // 3. User saving

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: serverTimestamp(),
        isAdmin: false,
      });

      // 4. Verification email
      await sendEmailVerification(user);

      alert(
        "Register completed, please use the link sent to your email to verify your account.",
      );
      form.reset();
    } catch (error) {
      console.log("Error:", error);
      let message = "Can't register, please try again later.";
      if (error.code == "auth/email-already-in-use") {
        message =
          "Email already in use. If you did not create an account with this email, please contact an admin for supports.";
      } else if (error.code == "auth/weak-password") {
        message = "Weak password, please choose a stronger password.";
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
