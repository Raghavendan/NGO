import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, set, push, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
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
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);


function createAdminUser() {
  const adminRef = dbRef(database, 'admin');
  set(adminRef, {
    userID: "admin001",
    adminName:"Aakash",
    password: "karpingo"
  })
  .then(() => {
    console.log('Admin Login successfully!');

  })
  .catch((error) => {
    console.error('Error creating admin user:', error);
  });
}

createAdminUser();

export {
  firebaseConfig,
  database,
  dbRef,
  set,
  push,
  onValue,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL
};