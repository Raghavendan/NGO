import React, { useEffect, useRef, useState } from 'react';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';
import { NeatConfig, NeatGradient } from "@firecms/neat";

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
          navigate('/admin', { state: { adminName: adminData.adminName } }); // Redirect to admin dashboard

          window.location.href = '/admin';
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

  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      colors: [
        { color: "#3E42A6", enabled: true },
        { color: "#FFFFFF", enabled: true },
        { color: "#3E42A6", enabled: true },
        { color: "#6F74D6", enabled: true },
        { color: "#f5e1e5", enabled: false }
      ],
      speed: 5,
      horizontalPressure: 3,
      verticalPressure: 6,
      waveFrequencyX: 1,
      waveFrequencyY: 2,
      waveAmplitude: 3,
      shadows: 0,
      highlights: 2,
      colorBrightness: 1,
      colorSaturation: 7,
      wireframe: false,
      colorBlending: 8,
      backgroundColor: "#003FFF",
      backgroundAlpha: 1,
      resolution: 1
    });


    return () => gradientRef.current.destroy();
  }, [canvasRef]);

  return (
    <div style={{ position: "relative", height: "100vh", marginTop: "-80px" }}>
      <canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh", // Ensure it covers the full viewport height
          zIndex: -1, // Place the canvas behind other content
          margin: 0, // Remove default margin
          padding: 0  // Remove default padding
        }}
        ref={canvasRef}
      />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className='adlog'>Admin Login</h2>
          <form className='adcont' onSubmit={handleLogin} style={{ display: "inline-block", marginTop: "20px" }}>
            <div>
              <label>User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
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
      </div>
    </div>
  );
}

export default AdminLogin;
