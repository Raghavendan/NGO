import './styles/App.css';
import Navbar from './Navbar';
import Home from './Home';
import Event from './Event';
import Chat from './Chat';
import Donate from './Donate';
import About from './About';
import Footer from './footer';
import VolunteerSignup from './VSignup';
import AdminDash from './AdminDash';
import Adlog from './Adminlogin';
import PostEvent from './PostEvent';
import {BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <div className="App"> 

        
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/event" element={<Event/>}/>
              <Route path="/post" element={<PostEvent/>}/>


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
