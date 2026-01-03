import './Component/Nav & Foot/App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import('./Component/Major/Home'));
const Event = lazy(() => import('./Component/Admin/Event'));
const Chat = lazy(() => import('./Component/Major/Chat'));
const Donate = lazy(() => import('./Component/Major/Donate'));
const About = lazy(() => import('./Component/Major/About'));
const Volunteerhome = lazy(() => import('./Component/Major/VolunteerHome'));
const VolunteerSignup = lazy(() => import('./Component/Volunteer/VSignup'));
const AdminDash = lazy(() => import('./Component/Admin/AdminDash'));
const Adlog = lazy(() => import('./Component/Admin/Adminlogin'));
const PostEvent = lazy(() => import('./Component/Major/PostEvent'));
const VolunteerProfile = lazy(() => import('./Component/Volunteer/VolunteerProfile'));
const ManageVolunteers = lazy(() => import('./Component/Admin/ManageVolunteers'));

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/post" element={<PostEvent />} />
            <Route path="/volunteerHome" element={<Volunteerhome />} />
            <Route path="/volunteerProfile" element={<VolunteerProfile />} />
            <Route path="/manage-volunteers" element={<ManageVolunteers />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/abt" element={<About />} />
            <Route path="/signup" element={<VolunteerSignup />} />
            <Route path="/adminhome" element={<AdminDash />} />
            <Route path="/admin" element={<Adlog />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
