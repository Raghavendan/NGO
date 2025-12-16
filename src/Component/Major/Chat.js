import React, { useEffect, useState } from 'react';
import { auth, database } from '../Database/firebase.js';
import { ref, push, onValue } from 'firebase/database';
import EmojiPicker from 'emoji-picker-react';
import Menubar from "../Nav & Foot/menubar";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosImage } from "react-icons/io";
import './Chat.css';
import ico from "../../assets/icon.jpg";

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(ico);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `Volunteers/${user.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username || 'Volunteer');
            setProfileImage(userData.photoUrl || ico);
          }
        });
      } else {
        setUsername('Guest');
      }
    };

    fetchUserData();

    const messagesRef = ref(database, 'ChatMessages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.values(data) : [];
      setMessages(messagesArray);
    });
  }, [auth, database]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() || selectedImage) {
      const timestamp = new Date();
      let hours = timestamp.getHours();
      const minutes = String(timestamp.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedTimestamp = `${timestamp.toLocaleDateString()} ${hours}:${minutes} ${ampm}`;

      const newMessage = {
        username,
        profileImage,
        text: message,
        timestamp: formattedTimestamp,
        imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : null,
      };

      await push(ref(database, 'ChatMessages'), newMessage);
      setMessage('');
      setSelectedImage(null);
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Hide the emoji picker after selecting an emoji
  };

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
    setShowEmojiPicker(false); // Ensure the emoji picker is hidden when selecting an image
  };

  return (
    <div className="chat-container">
      <Menubar />
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message" style={{ justifyContent: msg.username === username ? 'flex-end' : 'flex-start' }}>
            <img src={msg.profileImage || ico} alt="Profile" className="profile-image" />
            <div className="message-content">
              <strong>{msg.username}</strong>
              <p>{msg.text}</p>
              {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="uploaded-image" />}
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        
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

        <MdOutlineEmojiEmotions className='ic' type="button " onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          
        </MdOutlineEmojiEmotions >

        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker  onEmojiClick={handleEmojiClick} />
          </div>
        )}
        
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default Chat;
