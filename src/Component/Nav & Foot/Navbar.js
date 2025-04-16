import './App.css';
import React, { useState } from 'react';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import ico from "../../assets/icon.jpg";
import { FaBars, FaTimes, FaUserShield, FaUserFriends } from "react-icons/fa";
import AlertModal from "../Dialog box/AlertModal";

function Navbar() {
  const navRef = useRef();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null); // State to manage alert message visibility

  // Toggle the navbar in mobile view
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  const admin = () => {
    navigate('/adminlogin'); // Navigate to the admin login page
  };

  const handleRestrictedAccess = () => {
    setAlertMessage("This feature is accessible only for volunteers.");
  };

  const closeAlert = () => {
    setAlertMessage(null); // Close the alert modal
  };

  return (
    <>
      <header>
        <div className="logo-section">
          <img src={ico} alt="KARPI Logo" className="logo-image" />
          <h3 className="logoname">KARPI</h3>
        </div>
        <nav ref={navRef}>
          <a href="/">Home</a>
          <a onClick={handleRestrictedAccess}>Post</a>
          <a onClick={handleRestrictedAccess}>Chat</a>
          <a href="/donate">Donate</a>
          <a href="/abt">About</a>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <div className='icon-buttons'>
          <div className='btn-1' onClick={admin}>
            <FaUserShield title="Admin" id='faicon' />
            <span className='small'>Admin</span>
          </div>
          <div className='btn-2' onClick={handleSignupClick}>
            <FaUserFriends title="Volunteer" id='faicon' />
            <span className='small'>Volunteer</span>
          </div>
        </div>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>

      {/* Display the AlertModal only when alertMessage is not null */}
      {alertMessage && <AlertModal message={alertMessage} onClose={closeAlert} />}
    </>
  );
}

export default Navbar;
