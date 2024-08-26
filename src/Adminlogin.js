import React, { useState } from 'react';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

import { database } from './firebase'; // Importing database correctly

function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Directly reference the 'admin' node
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      if (adminData) {
        if (adminData.userID === userId && adminData.password === password) {
          // Successful login
          window.location.href = '/admin';
          navigate('/admin', { state: { adminName: adminData.adminName } }); // Redirect to admin dashboard
        } else {
          setError('Invalid user ID or password');
        }
      } else {
        setError('Admin data not found');
      }
    } catch (err) {
      setError('Error during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default AdminLogin;
