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
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const db = getDatabase();
      const userRef = ref(db, `Volunteers/${userId}`);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username || "Volunteer");
            setProfileImage(userData.photoUrl || null);
          } else {
            console.log("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setUsername('Guest');
      setProfileImage(null);
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

  

  // Render profile image or username initial
  const renderProfileImage = () => {
    if (profileImage) {
      return <img src={profileImage} alt="Profile" className='profile-image' />;
    } else {
      return <span className='profile-initial'>{username.charAt(0).toUpperCase()}</span>;
    }
  };
  

  return (
    <header>
      <div className="logo-section">
        <img src={ico} alt="KARPI Logo" className="logo-image" />
        <h3 className="logoname">KARPI</h3>
      </div>
      <nav ref={navRef}>
        <Link to="/volunteerHome">home</Link>
        <Link to="/post">post</Link>
        <Link to="/chat">chat</Link>
        <Link to="/donate">donate</Link>
        <Link to="/abt">about</Link>
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
              <li onClick={() => navigate('/volunteerProfile')}>profile</li>
              <li onClick={handleLogout}>logout</li>
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
