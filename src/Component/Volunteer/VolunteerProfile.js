import React, { useEffect, useState } from 'react';
import { auth, database, storage } from '../Database/firebase.js';
import '../Volunteer/VolunteerProfile.css';
import Menubar from '../Nav & Foot/menubar'
import { ref, get, set, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ username: '', email: '', mobile: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `Volunteers/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setUpdatedData({ username: data.username, email: data.email, mobile: data.mobile });
        } else {
          console.log("No user data found");
        }
      } else {
        console.log("No user is logged in");
      }
    };
    fetchUserData();
  }, [auth, database]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const user = auth.currentUser;
      const storageReference = storageRef(storage, `profilePictures/${user.uid}`);

      try {
        await uploadBytes(storageReference, file);
        const downloadURL = await getDownloadURL(storageReference);
        const userRef = ref(database, `Volunteers/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const existingData = snapshot.val();
          await set(userRef, {
            ...existingData,
            photoUrl: downloadURL,
          });
          setUserData({ ...existingData, photoUrl: downloadURL });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (auth.currentUser) {
      const userRef = ref(database, `Volunteers/${auth.currentUser.uid}`);
      try {
        await update(userRef, updatedData);
        setUserData(updatedData);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  return (
    <div className='pro'>
    <Menubar/>
    <div className="profile-main-container">
      <h3 className="profile-header">Volunteer Profile</h3>
      <div className="profile-container">
        <div className="picture-container">
          {userData?.photoUrl && (
            <img 
              src={userData.photoUrl} 
              alt={`${userData.username || 'User'}'s profile`} 
              className="profile-picture"
            />
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>
        {userData ? (
          <div className="detail-container">
            {isEditing ? (
              <>
                <input 
                  type="text" 
                  name="username" 
                  value={updatedData.username} 
                  onChange={handleInputChange} 
                  placeholder="Username" 
                  className="profile-input"
                />
                <input 
                  type="email" 
                  name="email" 
                  value={updatedData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email" 
                  className="profile-input"
                />
                <input 
                  type="tel" 
                  name="mobile" 
                  value={updatedData.mobile} 
                  onChange={handleInputChange} 
                  placeholder="Mobile" 
                  className="profile-input"
                />
                <div className='bspace'>
                      <button onClick={handleSaveChanges} className="save-button">Save</button>
                      <button onClick={handleEditToggle} className="cancel-button">Cancel</button>
                </div>
                
              </>
            ) : (
              <>
                <p className="uname"><strong>Username:</strong> {userData.username}</p>
                <div className='dc2'>
                  <p className="mail"><strong>Email:</strong> {userData.email}</p>
                  <p className="mobile"><strong>Mobile:</strong> {userData.mobile}</p>
                </div>
                
                <button onClick={handleEditToggle} className="edit-button">Edit</button>
              </>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
    </div>
    
  );
}

export default Profile;
