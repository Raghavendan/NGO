import React, {useRef,useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './VolunteerSignup.css';
import { auth, database } from '../Database/firebase.js';
import { FcGoogle } from "react-icons/fc";
import { NeatGradient } from "@firecms/neat";

import { signInWithEmailAndPassword, updatePassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import AlertModal from '../Dialog box/AlertModal'; // Import the AlertModal component

// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyAzqHIO-1C4V6uMP6evINH8Mv3Qd81DEcE",
//   authDomain: "karpingo-73250.firebaseapp.com",
//   projectId: "karpingo-73250",
//   storageBucket: "karpingo-73250.appspot.com",
//   messagingSenderId: "327982242100",
//   appId: "1:327982242100:web:214191ad5f7aa1062c2d61"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);  // Initialize the auth instance
// const database = getDatabase(app);  // Initialize the database instance

function VSignup() {
  const [login, setLogin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // State for forgot password
  const [resetSuccess, setResetSuccess] = useState(false); // State to track password reset success

  const history = useNavigate();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const identifier = e.target.emailOrMobile.value; // This field will accept either email or mobile number
    const password = e.target.password?.value;
  
    try {
      let email;
      if (forgotPassword && resetSuccess) {
        // Handle the new password reset process
        const newPassword = e.target.newPassword.value;
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, newPassword);
          setAlertMessage('Your password has been successfully reset. Please log in with your new password.');
          setShowAlert(true);
          setForgotPassword(false);
          setLogin(true);
          return;
        } else {
          throw new Error('User not found. Please log in again.');
        }
      }

      if (forgotPassword && !resetSuccess) {
        // Handle verification during forgot password flow (no password needed)
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
  
        // At this point, email is verified, we can now proceed to password reset
        setAlertMessage('User verified! Please enter a new password.');
        setShowAlert(true);
        setResetSuccess(true);
        return;
      }

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
        
  
        await signInWithEmailAndPassword(auth, email, password);
        setAlertMessage(`Welcome back! You are now logged in.`);
        setShowAlert(true);
        history('/volunteerHome');
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

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      // Check if user exists in database
      const usersRef = ref(database, 'Volunteers/' + user.uid);
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        // If the user does not exist, create the user in the database
        await set(usersRef, {
          email: email,
          username: user.displayName || "Google User",
          mobile: user.phoneNumber || "Not provided",
        });
        setAlertMessage(`Welcome ${user.displayName || "Google User"}! You are added as a Karpi Volunteer.`);
      } else {
        setAlertMessage(`Welcome back, ${user.displayName || "Google User"}! You are now logged in.`);
      }

      setShowAlert(true);
      history('/volunteerHome');
    } catch (error) {
      setAlertMessage(`Google sign-in failed: ${error.message}`);
      setShowAlert(true);
    }
  };
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      "colors": [
        { "color": "#3E42A6", "enabled": true },
        { "color": "#FFFFFF", "enabled": true },
        { "color": "#3E42A6", "enabled": true },
        { "color": "#6F74D6", "enabled": true },
        { "color": "#f5e1e5", "enabled": false }
    ],
    "speed": 5,
    "horizontalPressure": 3,
    "verticalPressure": 6,
    "waveFrequencyX": 1,
    "waveFrequencyY": 2,
    "waveAmplitude": 3,
    "shadows": 0,
    "highlights": 2,
    "colorBrightness": 1,
    "colorSaturation": 7,
    "wireframe": false,
    "colorBlending": 8,
    "backgroundColor": "#003FFF",
    "backgroundAlpha": 1,
    "resolution": 1
    });

    return () => gradientRef.current.destroy();
  }, [canvasRef]);

  return (
    <div className="App">
          <canvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: -1,
              margin: 0,
              padding: 0
            }}
            ref={canvasRef}
          />
        <div className='Lapp'>           
              <div className='row'>
                <div className={login === false ? 'activeColor' : 'pointer'} onClick={() => setLogin(false)}>SignUp</div>
                <div className={login === true && !forgotPassword ? 'activeColor' : 'pointer'} onClick={() => setLogin(true)}>Login</div>
              </div>
          {/* Update the heading conditionally */}
          
          <form onSubmit={(e) => handleSubmit(e, login ? 'login' : 'signup')}>
            <h2>{forgotPassword ? 'Reset Password' : login ? 'Login' : 'SignUp'}</h2>
              {!login && (
                <>
                  <input name='username' placeholder='Username' /><br />
                  <input name='mobile' placeholder='Mobile' /><br />
                </>
              )}
              <input name='emailOrMobile' placeholder={login ? 'Email or Mobile' : 'Email'} required /><br />
              {!forgotPassword && (
                <>
                  <input name='password' type='password' placeholder='Password' required={!forgotPassword} /><br />
                </>
              )}
              {forgotPassword && resetSuccess && (
                <>
                  <input name='newPassword' type='password' placeholder='Enter new password' required /><br />
                </>
              )}
              <button type="submit">
                {forgotPassword && resetSuccess ? 'Update Password' : forgotPassword ? 'Verify User' : login ? 'Login' : 'Signup'}
              </button>
              {/* Google Sign-In Button */}
                {login && !forgotPassword && (
                  <div className="g"  onClick={handleGoogleSignIn}>
                    <FcGoogle className='gb' type="button"></FcGoogle>
                    <span style={{fontWeight: "550"}}>Login with Google</span>
                    
                  </div>
                )}
          </form>

          

          {/* Forgot Password section */}
          {!forgotPassword && login && (
            <div className="footer" onClick={() => setForgotPassword(true)}>
              Forgot Password
            </div>
          )}

          {/* Back to Login link below Reset Password */}
            {forgotPassword && (
              <div className="footer" onClick={() => setForgotPassword(false)}>
                Back to Login
              </div>
            )}

            {showAlert && <AlertModal message={alertMessage} onClose={() => setShowAlert(false)} />}
        </div>

    </div>
    
  );
}

export default VSignup;
