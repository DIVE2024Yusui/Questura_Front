import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyAsOWUt-xOULzEYGw7e-n6O0qa7egzZCSY",
  authDomain: "questura-d1542.firebaseapp.com",
  projectId: "questura-d1542",
  storageBucket: "questura-d1542.appspot.com",
  messagingSenderId: "891309750314",
  appId: "1:891309750314:web:9e26c8c20d94e16f8c6b53",
};
// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증 및 Firestore 가져오기
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
