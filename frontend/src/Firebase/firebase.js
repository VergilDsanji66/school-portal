import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB3G3yhVV0Lrj_KHAX5EsAg3OYKF5Zfpc4",
  authDomain: "school-portal-f0168.firebaseapp.com",
  projectId: "school-portal-f0168",
  storageBucket: "school-portal-f0168.firebasestorage.app",
  messagingSenderId: "585955060006",
  appId: "1:585955060006:web:2ff53b6d1ddefe5a80f9e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { app, database };