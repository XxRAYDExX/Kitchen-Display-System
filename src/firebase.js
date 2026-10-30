import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA682Nt_2h_OdhrsUuhvKVu6xc8VhlVgX4",
  authDomain: "kds-demo-2c34c.firebaseapp.com",
  projectId: "kds-demo-2c34c",
  storageBucket: "kds-demo-2c34c.firebasestorage.app",
  messagingSenderId: "619119111345",
  appId: "1:619119111345:web:388b143f278a7cb7c4c690",
  measurementId: "G-BC6830FT54"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
