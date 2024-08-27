import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/VolunteerSignup.css';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import AlertModal from './AlertModal'; // Import the AlertModal component

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
   apiKey: "AIzaSyAzqHIO-1C4V6uMP6evINH8Mv3Qd81DEcE",
    authDomain: "karpingo-73250.firebaseapp.com",
    projectId: "karpingo-73250",
    storageBucket: "karpingo-73250.appspot.com",
    messagingSenderId: "327982242100",
    appId: "1:327982242100:web:214191ad5f7aa1062c2d61"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize the auth instance
const database = getDatabase(app);  // Initialize the database instance

function VSignup() {
  const [login, setLogin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const history = useNavigate();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const identifier = e.target.emailOrMobile.value; // This field will accept either email or mobile number
    const password = e.target.password.value;
  
    try {
      let email;
      if (type === 'login') {
        if (identifier.includes('@')) {
          email = identifier;
        } else {
          const usersRef = ref(database, 'Volunteers');
          const snapshot = await get(usersRef);
  
          const users = snapshot.val();
          const user = Object.values(users).find(user => user.mobile === identifier);
  
          if (user) {
            email = user.email;
          } else {
            throw new Error('No user found with this mobile number');
          }
        }
  
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setAlertMessage(`Welcome back! You are now logged in.`);
        setShowAlert(true);
        history('/');
      } else {
        email = identifier;
        const username = e.target.username?.value;
        const mobile = e.target.mobile?.value;
  
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        await set(ref(database, 'Volunteers/' + user.uid), {
          username: username,
          email: email,
          mobile: mobile,
          password: password,
        });
  
        setAlertMessage(`Welcome ${username}! You are added as a Karpi Volunteer. Please Login!!!`);
        setShowAlert(true);
        history('/signup');
      }
    } catch (err) {
      setAlertMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} failed: ${err.message}`);
      setShowAlert(true);
      setLogin(true);
    }
  };

  return (
    <div className='Lapp'>
      <div className='row'>
        <div className={login === false ? 'activeColor' : 'pointer'} onClick={() => setLogin(false)}>SignUp</div>
        <div className={login === true ? 'activeColor' : 'pointer'} onClick={() => setLogin(true)}>Login</div>
      </div>
      <h2>{login ? 'Login' : 'SignUp'}</h2>
      <form onSubmit={(e) => handleSubmit(e, login ? 'login' : 'signup')}>
          {!login && (
            <>
              <input name='username' placeholder='Username' /><br />
              <input name='mobile' placeholder='Mobile' /><br />
            </>
          )}
          <input name='emailOrMobile' placeholder={login ? 'Email or Mobile' : 'Email'} /><br />
          <input name='password' type='password' placeholder='Password' /><br />
          <button>{login ? 'Login' : 'Signup'}</button>
        </form>

      {showAlert && <AlertModal message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
}

export default VSignup;
