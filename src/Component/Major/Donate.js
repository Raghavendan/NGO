/* global Cashfree */
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosImage, IoIosArrowBack } from "react-icons/io";
import '../Major/Donate.css'; // Ensure correct path
import ico from "../../assets/icon.jpg"; // Ensure correct path

function Donate() {
  const navigate = useNavigate();
 

  const handleBack = () => {
    navigate(-1);
  }; 

  return (
    <div className="donate">
      <div className="title">
        <button className="back-button" onClick={handleBack}>
          <IoIosArrowBack className="ic" />
        </button>
        <h2>Donation</h2>
      </div>
      
        
       

    </div>
  );
}

export default Donate;
