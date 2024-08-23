import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/VolunteerSignup.css';
import { database } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set , get } from 'firebase/database';
import AlertModal from './AlertModal'; // Import the AlertModal component

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
          // It's an email
          email = identifier;
        } else {
          // It's a mobile number; retrieve the corresponding email from the database
          const db = getDatabase();
          const usersRef = ref(db, 'Volunteers');
          const snapshot = await get(usersRef);
  
          const users = snapshot.val();
          const user = Object.values(users).find(user => user.mobile === identifier);
  
          if (user) {
            email = user.email;
          } else {
            throw new Error('No user found with this mobile number');
          }
        }
  
        const userCredential = await signInWithEmailAndPassword(database, email, password);
        setAlertMessage(`Welcome back! You are now logged in.`);
        setShowAlert(true);
        history('/');
      } else {
        const email = identifier;
        const username = e.target.username?.value;
        const mobile = e.target.mobile?.value;
  
        const userCredential = await createUserWithEmailAndPassword(database, email, password);
        const user = userCredential.user;
  
        const db = getDatabase();
        await set(ref(db, 'Volunteers/' + user.uid), {
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
