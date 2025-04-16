import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import './NewVol.css';
import {
  database,
  dbRef,
  set,
  push,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL
} from '../Database/firebase';

function NewVol() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleAddVolunteer = async (e) => {
    e.preventDefault();

    if (!username || !email || !mobile || !password || !photoFile) {
      setMessage('Please fill all fields and upload a photo.');
      return;
    }

    setUploading(true);
    try {
      const newVolRef = push(dbRef(database, 'Volunteers'));
      const volId = newVolRef.key;

      const imageRef = storageRef(storage, `profilePictures/${volId}`);
      await uploadBytes(imageRef, photoFile);

      const photoUrl = await getDownloadURL(imageRef);

      const newVolunteerData = {
        username,
        email,
        mobile,
        password,
        photoUrl,
      };

      await set(newVolRef, newVolunteerData);
      setMessage('Volunteer added successfully!');

      setUsername('');
      setEmail('');
      setMobile('');
      setPassword('');
      setPhotoFile(null);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error uploading or saving data.');
    }
    setUploading(false);
  };

  return (
    <>

       <div className="new-vol-container">
       <h2>Add New Volunteer</h2>

      <form onSubmit={handleAddVolunteer}>
        <div>
          <input type="text" placeholder="Username"value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <input type="email" placeholder="Mail id" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <input type="text" placeholder="Mobile No"value={mobile} onChange={(e) => setMobile(e.target.value)} required />
        </div>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
              {showPassword ? <FaEyeSlash /> : <FaEye />}          </button>
        </div>

        <div className='profile-upload'>
          <input type="file" accept="image/*" placeholder="Profile Picture"onChange={(e) => setPhotoFile(e.target.files[0])} required />
        </div>
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Volunteer'}
        </button>
      </form>
      {message && <p className="vol-message">{message}</p>}
    </div>
    </>
    
  );
}

export default NewVol;
