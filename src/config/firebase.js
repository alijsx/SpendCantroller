// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKo3J4Sp8qMYpkhbWTSDQpbyf6jJbK7Ww",
  authDomain: "for-testing-2baf5.firebaseapp.com",
  databaseURL: "https://for-testing-2baf5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "for-testing-2baf5",
  storageBucket: "for-testing-2baf5.appspot.com",
  messagingSenderId: "652138421847",
  appId: "1:652138421847:web:dd798d1095346df020cd12",
  measurementId: "G-Z6B0Q153KL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestore, storage };
export default firebase;
