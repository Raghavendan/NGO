import React, { useEffect, useRef, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import '../Admin/Admin.css';
import { NeatGradient } from "@firecms/neat";
import { database } from '../Database/firebase';
// import BG from'../../assets/blue_admin_bg.webp';

function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false); // New state to show/hide the change password form
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      if (adminData) {
        if (adminData.userID === userId && adminData.password === password) {
          navigate('/adminhome', { state: { adminName: adminData.adminName } });
          window.location.href = '/adminhome';
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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      if (adminData && adminData.userID === userId) {
        await set(adminRef, { ...adminData, password: newPassword });
        setShowChangePassword(false); // Hide change password form after success
        setError('Password changed successfully! Please log in with your new password.');
      } else {
        setError('Invalid user ID');
      }
    } catch (err) {
      setError('Error changing password');
      console.error('Change password error:', err);
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
    <div style={{  height: "100%" }}>
      <canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          margin: 0,
          padding: 0
        }}
        ref={canvasRef}
      />
      <form className='adcont' onSubmit={handleLogin} style={{ display: "inline-block", marginTop: "0px" }}>
              <h2 className='adlog'>Admin Login</h2>

                <div style={ { marginTop: "20px"}}>
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
                <span className='chg-pass' onClick={() => setShowChangePassword(true)} >
                  Change Password
                </span>
              </form>

      <div style={{  display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"  }}>
        <div style={{ textAlign: "center" }}>
          {!showChangePassword ? (
            <>

              
              {error && <p>{error}</p>}
            </>
          ) : (
            <>
              <form className='adcont' onSubmit={handleChangePassword} style={{ display: "inline-block", marginTop: "20px" }}>
                <div>
                <h2 className='adlog'>Change Password</h2>

                  <input
                    type="password"
                    placeholder='Enter a New Password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Change Password</button>
                <span onClick={() => setShowChangePassword(false)} className='bck'>
                  Back to Login
                </span>
              </form>
              {error && <p>{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
