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
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAmountClick = (amt) => {
    setAmount(amt);
  };

  const isValidInput = () => {
    if (!amount || !name || !email || !phone) {
      alert("Please fill all fields.");
      return false;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const createOrder = async (orderId) => {
    try {
      const response = await axios.post('http://localhost:3001/create-order', {
        order_id: orderId,
        order_amount: amount,
        customer_email: email,
        customer_phone: phone,
      });

      return response.data.order_token;
    } catch (error) {
      console.error('Error creating order:', error);
      alert("Error initiating payment. Please try again.");
      return null;
    }
  };

  const handlePayment = async () => {
    if (!amount) {
        alert("Please enter a donation amount.");
        return;
    }

    const orderId = `order_${Date.now()}`; // Generate a unique order ID

    // Call the backend to create an order
    try {
        const response = await axios.post('http://localhost:3001/create-order', {
            order_id: orderId,
            order_amount: amount,
            customer_email: email,
            customer_phone: phone,
        });

        const { order_token } = response.data;

        if (!order_token) {
            throw new Error("Invalid order token received");
        }

        // Initialize Cashfree payment
        Cashfree.pay(order_token, {
            onSuccess: (data) => {
                console.log('Payment Success:', data);
                alert("Payment Successful!");
                // Optionally, handle post-payment logic here (e.g., update your database)
            },
            onFailure: (data) => {
                console.error('Payment Failed:', data);
                alert("Payment Failed!");
            },
            onClose: () => {
                console.log('Payment window closed');
            },
        });

    } catch (error) {
        console.error('Error initiating payment:', error.response ? error.response.data : error.message);
        alert("Error initiating payment. Please try again.");
    }
};


  const handleEmojiClick = (emojiObject) => {
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="donate">
      <div className="title">
        <button className="back-button" onClick={handleBack}>
          <IoIosArrowBack className="ic" />
        </button>
        <h2>Donation</h2>
      </div>
      <div className="donate-body">
        <div className="cont-amt">
          <span className="ini-amt" onClick={() => handleAmountClick(10)}>₹10</span>
          <span className="ini-amt" onClick={() => handleAmountClick(50)}>₹50</span>
          <span className="ini-amt" onClick={() => handleAmountClick(100)}>₹100</span>
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="don-input"
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          className="don-input"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          className="don-input"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter Phone"
          className="don-input"
        />

        {/* Image Upload */}
        <label htmlFor="image-upload" className="image-upload-label">
          <IoIosImage className='ic' />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {selectedImage && <img src={selectedImage} alt="Selected" className="preview-image" />}

        {/* Emoji Picker */}
        <MdOutlineEmojiEmotions className='ic1' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <button className="donate-btn" onClick={handlePayment}>Donate</button>
      </div>
    </div>
  );
}

export default Donate;
