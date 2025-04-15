import './Admindash.css'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import ico from "../../assets/icon.jpg";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { IoHome } from 'react-icons/io5';
import { MdEvent,MdMiscellaneousServices } from 'react-icons/md';
import { IoIosChatbubbles } from "react-icons/io";


function AdminDash() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [volunteerCount, setVolunteerCount] = useState(0);
	const navigate = useNavigate();
    const home = () => {
		navigate('/'); 
	};
    const event = () => {
		navigate('/event'); 
	};
    const chat = () => {
		navigate('/chat'); 
	};
    const Services = () => {
		navigate('/'); 
	  };
    const location = useLocation();
    const { adminName } = location.state || {};


    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAzqHIO-1C4V6uMP6evINH8Mv3Qd81DEcE",
        authDomain: "karpingo-73250.firebaseapp.com",
        projectId: "karpingo-73250",
        storageBucket: "karpingo-73250.appspot.com",
        messagingSenderId: "327982242100",
        appId: "1:327982242100:web:214191ad5f7aa1062c2d61"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());
        }, 1000);
    
        // Firebase Realtime Database: Listen for changes in the volunteer count
        const volunteerCountRef = ref(database, 'Volunteers/'); // Path to Volunteers node
        const unsubscribe = onValue(volunteerCountRef, (snapshot) => {
            const data = snapshot.val();
            // Log data to check its structure
            console.log(data);
            // Count the number of volunteers
            if (data) {
                const count = Object.keys(data).length;
                setVolunteerCount(count);
            } else {
                setVolunteerCount(0); // Default value if no data
            }
        });
    
        // Cleanup function
        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    }, [database]);

    return (
        <div className='admin'>
            <section className='admin_header'>
                <div className='forLogo'>
                    <img className='adlogo' src={ico} alt="Admin Logo" />
                </div>
                <div className='adname'>
                    {adminName ? <h3>Vanakkam🙏 {adminName} </h3> : <p>Loading...</p>}         
                </div>
                <div className='empty'></div>
                <div className='headerleft'>
                    <div id='headerleft'>
                        <span>{time}</span>
                        <img id='adicon' src="https://cdn-icons-png.flaticon.com/128/2784/2784459.png" alt="Clock Icon" />
                    </div>
                    <div id='headerleft'>
                        <span>{date}</span>
                        <img id='adicon' src="https://cdn-icons-png.flaticon.com/128/3652/3652191.png" alt="Calendar Icon" />
                    </div>
                    <div id='headerleft'>
                        <span>Chat</span>
                        <img id='adicon' src='https://cdn-icons-png.flaticon.com/128/1041/1041916.png' alt="Chat Icon" />
                    </div>
                    <div id='headerleft'>
                        <span>Post</span>
                        <img id='adicon' src='https://cdn-icons-png.flaticon.com/128/8103/8103709.png' alt="Notification Icon" />
                    </div>
                </div>
            </section>
            <div className="cont3">
                <div id="bg1" className="nvol">
                    <span>Volunteers</span>
                    <span>{volunteerCount}</span>
                    <img  src="https://cdn-icons-png.flaticon.com/128/3045/3045363.png" alt="Volunteers Icon" />
                </div>
                <div id="bg1" className="nwall">
                    <span>Paintings</span>
                    <img  src="https://cdn-icons-png.flaticon.com/128/11000/11000159.png" alt="Paintings Icon" />
                </div>
                <div id="bg1" className="ndon">
                    <span>Donations</span>
                    <img  src="https://cdn-icons-png.flaticon.com/128/2618/2618524.png" alt="Donations Icon" />
                </div>
            </div>
            <div className="cont4">
                <div className="vhome" onClick={home}>
                    <div id="bg2">
                        <IoHome id="bg2img"></IoHome>                        
                        <span id='bg2span'>Home</span>
                    </div>
                </div>
                <div className="vevent" onClick={event}>
                    <div id="bg2">
                        <MdEvent id="bg2img"></MdEvent>                        
                        <span id='bg2span'>Event</span>
                    </div>
                </div>
                <div className="vchat" onClick={chat}>
                    <div id="bg2">
                        <IoIosChatbubbles id="bg2img"></IoIosChatbubbles>                        
                        <span id='bg2span'>Chat</span>

                    </div>
                </div>
                <div className="vser" onClick={Services}>
                    <div id="bg2">
                        <MdMiscellaneousServices id="bg2img"></MdMiscellaneousServices>                        
                        <span id='bg2span'>Services</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDash;
