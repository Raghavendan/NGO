import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, database, storage } from '../Database/firebase.js';
import { ref, push, onValue, update, remove, onDisconnect, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import EmojiPicker from 'emoji-picker-react';
import Menubar from "../Nav & Foot/menubar";
import Sidebar from '../Nav & Foot/Sidebar';
import { MdOutlineEmojiEmotions, MdDelete } from "react-icons/md";
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [statusData, setStatusData] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const location = useLocation();
  const isAdminChat = location.state?.from === 'admin';

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
          } else if (isAdminChat) {
            setUsername('Admin');
          }
        });
      } else {
        setUsername(isAdminChat ? 'Admin' : 'Guest');
      }
    };

    fetchUserData();

    const messagesRef = ref(database, 'ChatMessages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.entries(data).map(([key, msg]) => ({ key, ...msg })) : [];
      setMessages(messagesArray);
    });

    const usersRef = ref(database, 'Volunteers');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([uid, userData]) => ({ uid, ...userData }));
        setUsers(usersArray);
      }
    });

    const statusRef = ref(database, 'status');
    onValue(statusRef, (snapshot) => {
      setStatusData(snapshot.val() || {});
    });

    // Set presence
    if (auth.currentUser) {
      const userStatusRef = ref(database, `status/${auth.currentUser.uid}`);
      set(userStatusRef, { online: true });
      onDisconnect(userStatusRef).set({ online: false });
    }

    const handleResize = () => {
        if(window.innerWidth > 768){
            setSidebarOpen(true);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [auth, database, isAdminChat]);

  useEffect(() => {
    const onlineUids = Object.keys(statusData).filter(uid => statusData[uid]?.online && uid !== auth.currentUser?.uid);
    const onlineUsersFiltered = users.filter(u => onlineUids.includes(u.uid));
    setOnlineUsers(onlineUsersFiltered);
  }, [users, statusData, auth]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() || selectedImage) {
      const timestamp = new Date();
      let hours = timestamp.getHours();
      const minutes = String(timestamp.getMinutes());
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedTimestamp = `${timestamp.toLocaleDateString()} ${hours}:${minutes} ${ampm}`;

      let imageUrl = null;
      if (selectedImage) {
        try {
          const imageRef = storageRef(storage, `chatImages/${Date.now()}_${selectedImage.name}`);
          await uploadBytes(imageRef, selectedImage);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      const newMessage = {
        username,
        profileImage,
        text: message,
        timestamp: formattedTimestamp,
        imageUrl,
      };

      try {
        await push(ref(database, 'ChatMessages'), newMessage);
        setMessage('');
        setSelectedImage(null);
        setShowEmojiPicker(false);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Hide the emoji picker after selecting an emoji
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    setShowEmojiPicker(false);
  };

  const handleEdit = (key) => {
    const msg = messages.find(m => m.key === key);
    setEditingKey(key);
    setEditText(msg.text);
  };

  const handleSaveEdit = async () => {
    const msgRef = ref(database, `ChatMessages/${editingKey}`);
    await update(msgRef, { text: editText });
    setEditingKey(null);
    setEditText('');
  };

  const handleDelete = async (key) => {
    const msgRef = ref(database, `ChatMessages/${key}`);
    await remove(msgRef);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={isAdminChat ? 'admin-page' : ''}>
      {isAdminChat ? <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} /> : <Menubar />}
      <div className={isAdminChat ? 'chat-admin-content' : "chat-main"}>
            {isAdminChat}
            <div className="active-users">
              <h3>Active</h3>
              {onlineUsers.map(user => (
                <div key={user.uid} className="user-item">
                  <img src={user.photoUrl || ico} alt="Profile" className="user-profile" />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          <div className="chat-section">
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div key={msg.key} className={`message ${msg.username === username ? 'own' : 'other'}`}>
                    {msg.username !== username && (
                      <img src={msg.profileImage || ico} alt="Profile" className="profile-image" />
                    )}
                    <div className="message-content">
                      <strong>{msg.username}</strong>
                      {editingKey === msg.key ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="edit-input"
                          />
                          <button onClick={handleSaveEdit} className="save-edit">Save</button>
                          <button onClick={() => setEditingKey(null)} className="cancel-edit">Cancel</button>
                        </>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="uploaded-image" />}
                      <span className="timestamp">{msg.timestamp}</span>
                      {msg.username === username && editingKey !== msg.key && (
                        <div className="message-actions">
                          <button onClick={() => handleEdit(msg.key)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDelete(msg.key)} className="delete-btn"><MdDelete /></button>
                        </div>
                      )}
                    </div>
                    {msg.username === username && (
                      <img src={msg.profileImage || ico} alt="Profile" className="profile-image own-profile" />
                    )}
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

                  {previewUrl && (
                    <div className="image-preview-container">
                      <img src={previewUrl} alt="Preview" className="image-preview" />
                      <span className="file-name">{selectedImage.name}</span>
                    </div>
                  )}

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
      </div>
    </div>
  );
}

export default Chat;
