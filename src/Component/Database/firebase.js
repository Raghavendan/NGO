import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set ,push ,onValue} from 'firebase/database';
import { getStorage } from "firebase/storage";

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
  const adminRef = ref(database, 'admin');
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

// Call the function to create the admin user
createAdminUser();

export { database, ref, set, push, onValue ,storage };
