import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  doc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { auth, db, provider } from "./firebase.js";

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
    const uid = user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const username = userData.username;

    document.getElementById("account-btn").innerText = username;
    document.getElementById("account-btn").href =
      getCurrentLink() + "/dashboard.html";
  } else {
    document.getElementById("account-btn").href =
      getCurrentLink() + "/signin.html";
  }
});
