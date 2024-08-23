import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyAzqHIO-1C4V6uMP6evINH8Mv3Qd81DEcE",
    authDomain: "karpingo-73250.firebaseapp.com",
    projectId: "karpingo-73250",
    storageBucket: "karpingo-73250.appspot.com",
    messagingSenderId: "327982242100",
    appId: "1:327982242100:web:214191ad5f7aa1062c2d61"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app)