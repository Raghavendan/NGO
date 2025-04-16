import './Component/Nav & Foot/App.css';
import Home from './Component/Major/Home';
import Event from './Component/Admin/Event';
import Chat from './Component/Major/Chat';
import Donate from './Component/Major/Donate';
import About from './Component/Major/About';
import Volunteerhome from './Component/Major/VolunteerHome'
import VolunteerSignup from './Component/Volunteer/VSignup';
import AdminDash from './Component/Admin/AdminDash';
import Adlog from './Component/Admin/Adminlogin';
import PostEvent from './Component/Major/PostEvent';
import VolunteerProfile from './Component/Volunteer/VolunteerProfile';
import VolunteerList from './Component/Admin/ManVolunteer';
import NewVolunteer from './Component/Admin/NewVol';  
import {BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <div className="App"> 

        
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/event" element={<Event/>}/>
              <Route path="/post" element={<PostEvent/>}/>
              <Route path="/volunteerHome" element={<Volunteerhome/>}/>
              <Route path="/volunteerProfile" element={<VolunteerProfile/>}/>
              <Route path="/Admin/ManageVolunteers" element={<VolunteerList/>}/>
              <Route path="/Admin/AddVolunteers" element={<NewVolunteer/>}/>




              


              <Route path="/chat" element={<Chat/>}/>
              <Route path="/donate" element={<Donate/>}/>
              <Route path="/abt" element={<About/>}/>
              <Route path="/signup" element={<VolunteerSignup />} />
              <Route path="/admin" element={<AdminDash />} />
              <Route path="/adminlogin" element={<Adlog />} />


            </Routes>
               
          
        </div>
    </BrowserRouter>
    
  );
}

export default App;
