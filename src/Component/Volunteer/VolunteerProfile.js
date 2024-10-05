import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import '../Volunteer/VolunteerProfile.css';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

function Profile() {
  const [userData, setUserData] = useState(null);
  const auth = getAuth(); // Initialize Firebase Auth
  const database = getDatabase(); // Initialize Firebase Database
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        const userRef = ref(database, `Volunteers/${user.uid}`); // Reference to the user's data in the database
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Set the user data if found
        } else {
          console.log("No user data found");
        }
      } else {
        console.log("No user is logged in");
      }
    };

    fetchUserData();
  }, [auth, database]); // Add dependencies for auth and database

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const user = auth.currentUser; // Get the current user
      const storageReference = storageRef(storage, `profilePictures/${user.uid}`); // Create a reference to the storage location

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageReference, file);
        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageReference);
        
        // Log the download URL
        console.log("Download URL:", downloadURL);
        
        // Update the database with the new profile picture URL
        const userRef = ref(database, `Volunteers/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const existingData = snapshot.val();
          await set(userRef, {
            ...existingData,
            photoUrl: downloadURL,
          });

          // Update state
          setUserData({ ...existingData, photoUrl: downloadURL });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="profile-container">
      <h3 className="profile-header">Volunteer Profile</h3>
      {userData ? (
        <div>
          <p className="profile-details"><strong>Username:</strong> {userData.username}</p>
          <p className="profile-details"><strong>Email:</strong> {userData.email}</p>
          <p className="profile-details"><strong>Mobile:</strong> {userData.mobile}</p>
          <div className='profile-img'>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {userData.photoUrl && (
              <img 
                src={userData.photoUrl} 
                alt={`${userData.username}'s profile`} 
                style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
              />
            )}
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Profile;
