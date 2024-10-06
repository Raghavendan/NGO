import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database'; 
import ico from "../../assets/icon.jpg"; // Default icon
import { FaBars, FaTimes } from "react-icons/fa";
import '../Nav & Foot/App.css'; // Import the CSS file for styling

function Menubar() {
  const navRef = useRef();
  const auth = getAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Set to null initially

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
            setProfileImage(userData.photoUrl || null); // Set profile image if it exists
          } else {
            console.log("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setUsername('Guest');  // If no user is logged in, default to Guest
      setProfileImage(null); // No profile image for guest
    }
  }, [auth]);

  // Toggle the navbar in mobile view
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signup'); // Navigate to signup page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Function to render profile image or username initial
  const renderProfileImage = () => {
    if (profileImage) {
      return <img src={profileImage} alt="Profile" className='profile-image' />;
    } else {
      return <span className='profile-initial'>{username.charAt(0).toUpperCase()}</span>; // Display first letter
    }
  };

  return (
    <header>
      <div className="logo-section">
        <img src={ico} alt="KARPI Logo" className="logo-image" />
        <h3 className="logoname">KARPI</h3>
      </div>
      <nav ref={navRef}>
        <Link to="/volunteerHome">Home</Link>
        <Link to="/post">Post</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/donate">Donate</Link>
        <Link to="/abt">About</Link>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <div className='icon-buttons'>
        <div className='profile'>
        <span className='username'>{username}</span>
          {renderProfileImage()}
          
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
