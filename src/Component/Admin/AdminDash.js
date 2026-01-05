// import './Admin.css'
import { database } from '../Database/firebase.js';
import { ref, onValue, query, limitToLast, orderByChild } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import ico from "../../assets/icon.jpg";
import Sidebar from '../Nav & Foot/Sidebar';


function AdminDash() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [volunteerCount, setVolunteerCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [latestPosts, setLatestPosts] = useState([]);
    const [latestChats, setLatestChats] = useState([]);
    const [latestVolunteers, setLatestVolunteers] = useState([]);


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());
        }, 1000);

        const handleResize = () => {
            setSidebarOpen(window.innerWidth > 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Firebase Realtime Database: Listen for changes in the volunteer count
        const volunteerCountRef = ref(database, 'Volunteers/');
        const unsubscribeVolunteersCount = onValue(volunteerCountRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const count = Object.keys(data).length;
                setVolunteerCount(count);
            } else {
                setVolunteerCount(0);
            }
        });

        // Get last 4 posts
        const postsRef = query(ref(database, 'events'), orderByChild('date'), limitToLast(4));
        const unsubscribePosts = onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const postsArray = Object.values(data).reverse(); // reverse to show newest first
                setLatestPosts(postsArray);
            }
        });

        // Get last 4 chat messages
        const chatMessagesRef = query(ref(database, 'ChatMessages'), limitToLast(4));
        const unsubscribeChat = onValue(chatMessagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatsArray = Object.values(data).reverse(); // reverse to show newest first
                setLatestChats(chatsArray);
            }
        });

        // Get last 4 volunteers
        const volunteersRef = query(ref(database, 'Volunteers'), limitToLast(4));
        const unsubscribeVolunteers = onValue(volunteersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const volunteersArray = Object.values(data).reverse(); // reverse to show newest first
                setLatestVolunteers(volunteersArray);
            }
        });
    
        // Cleanup function
        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', handleResize);
            unsubscribeVolunteersCount();
            unsubscribePosts();
            unsubscribeChat();
            unsubscribeVolunteers();
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className='admin'>
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <div className='main-content'>
                <div className='admin__header'>                   
                    {<h3>Vanakkam </h3>}                
                    <div className='headerleft'>
                        <div></div>
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
                    <img className='adlogo' src={ico} alt="Admin Logo" />
                </div>
                <div className="cont3">
                    <div id="bg1" className="nvol">
                        <span>Volunteers</span>
                        <span>{volunteerCount}</span>
                        <img id='adicon' src="https://cdn-icons-png.flaticon.com/128/3045/3045363.png" alt="Volunteers Icon" />
                    </div>
                    <div id="bg1" className="nwall">
                        <span>Paintings</span>
                        <img id='adicon' src="https://cdn-icons-png.flaticon.com/128/11000/11000159.png" alt="Paintings Icon" />
                    </div>
                    <div id="bg1" className="ndon">
                        <span>Donations</span>
                        <img id='adicon' src="https://cdn-icons-png.flaticon.com/128/2618/2618524.png" alt="Donations Icon" />
                    </div>
                </div>

                <div className="dashboard-thumbnails">
                    <div className="last-volunteers">
                        <h4>Latest Volunteers</h4>
                        {latestVolunteers.length > 0 ? (
                            latestVolunteers.map((volunteer, index) => (
                                <div key={index} className="thumbnail-item">
                                    <p><strong>{volunteer.username}</strong></p>
                                    <p>{volunteer.email}</p>
                                    <p>{volunteer.mobile}</p>

                                </div>
                            ))
                        ) : (
                            <p>No new volunteers.</p>
                        )}
                    </div>
                    
                    <div className="last-chat">
                        <h4>Last Chats</h4>
                        {latestChats.length > 0 ? (
                            latestChats.map((chat, index) => (
                                <div key={index} className="thumbnail-item">
                                    <p><strong>{chat.username}</strong>: {chat.text}</p>
                                    <p>{chat.timestamp}</p>
                                </div>
                            ))
                        ) : (
                            <p>No chat messages available.</p>
                        )}
                    </div>
                    <div className="last-post">
                        <h4>Last Posts</h4>
                        {latestPosts.length > 0 ? (
                            latestPosts.map((post, index) => (
                                <div key={index} className="thumbnail-item">
                                    <p><strong>{post.title}</strong></p>
                                    <p>{new Date(post.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default AdminDash;
