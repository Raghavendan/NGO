import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database'; 
import ico from "../../assets/icon.jpg";
import { FaBars, FaTimes } from "react-icons/fa";

function Menubar() {
  const navRef = useRef();
  const auth = getAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/volunteerHome'); // Use navigate instead of history
      } else {
        navigate('/signup'); // Use navigate instead of history
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]); // Added navigate to the dependency array

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();  // Prevents navigating back
      window.history.pushState(null, null, window.location.pathname); // Stays on the current page
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;  // Get the current user's uid
      const db = getDatabase();  // Initialize the Firebase database
      const userRef = ref(db, `Volunteers/${userId}`);  // Reference to the current user's data

      // Fetch user data from Firebase Realtime Database
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username || "Volunteer");  // Set the username
          } else {
            console.log("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setUsername('Guest');  // If no user is logged in, default to Guest
    }
  }, [auth]);

  // Toggle the navbar in mobile view
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  }; 

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';  // Get first letter and capitalize it
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setAlertMessage('You have been logged out.');
      setShowAlert(true);
      navigate('/signup'); // Corrected to use navigate
    } catch (error) {
      setAlertMessage(`Logout failed: ${error.message}`);
      setShowAlert(true);
    }
  };
  
  return (
    <header>
      <div className="logo-section">
        <img src={ico} alt="KARPI Logo" className="logo-image" />
        <h3 className="logoname">KARPI</h3>
      </div>
      <nav ref={navRef}>
        <a href="/volunteerHome">Home</a>
        <a href="/post">Post</a>
        <a href="/chat">Chat</a>
        <a href="/donate">Donate</a>
        <a href="/abt">About</a>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <div className='icon-buttons'>
        <div className='profile'>
            <span>{username}</span>
            {username ? (
                    <div className='profile-initial'>
                    {getInitial(username)}
                    </div>
                ) : (
                    <img src={ico} alt="Profile" className='profile-image' />
            )}
            <div className='profile-dropdown'>
                <ul>
                <li onClick={() => navigate('/volunteerProfile')}>Profile</li>
                <li onClick={handleLogout}>Logout</li>
                </ul>
            </div>
        </div>
      </div>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Menubar;
