// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuLxKt4yk-lrwoT4PRta-23julfn1UfNU",
  authDomain: "scheduling-platform-prathyu.firebaseapp.com",
  projectId: "scheduling-platform-prathyu",
  storageBucket: "scheduling-platform-prathyu.appspot.com",
  messagingSenderId: "453306944815",
  appId: "1:453306944815:web:a7ebd965adc328048365da",
  measurementId: "G-G8R6X3XX0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword };