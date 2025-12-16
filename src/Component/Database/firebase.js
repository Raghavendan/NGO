import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDatabase, ref, set ,push ,onValue} from 'firebase/database';
import { getStorage } from "firebase/storage";

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
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

createAdminUser();

export { database, ref, set, push, onValue ,storage };