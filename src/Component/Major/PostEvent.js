import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { database, auth } from "../Database/firebase";
import "../Major/PostEvent.css"; 
import Menubar from "../Nav & Foot/menubar";
import Sidebar from "../Nav & Foot/Sidebar";

const PostEvent = () => {
    const [events, setEvents] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const user = auth.currentUser;
    const location = useLocation();
    const isAdminView = location.state?.from === 'admin';

    useEffect(() => {
        const eventRef = ref(database, 'events');
        
        onValue(eventRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedEvents = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                })).reverse(); // Show newest first
                setEvents(loadedEvents);
            }
        });

        const handleResize = () => {
            if(window.innerWidth > 768){
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLike = (eventId) => {
        const user = auth.currentUser;
        if (!user) return; 

        const currentEvent = events.find(e => e.id === eventId);
        const currentReaction = currentEvent.reactions?.[user.uid];

        if (currentReaction === 'like') {
            const newReactions = { ...(currentEvent.reactions || {}) };
            delete newReactions[user.uid];
            const updates = { reactions: newReactions, likes: (currentEvent.likes || 0) - 1 };
            update(ref(database, `events/${eventId}`), updates);
        } else {
            const newReactions = { ...(currentEvent.reactions || {}), [user.uid]: 'like' };
            const updates = { reactions: newReactions, likes: (currentEvent.likes || 0) + 1 };
            if (currentReaction === 'dislike') {
                updates.dislikes = (currentEvent.dislikes || 0) - 1;
            }
            update(ref(database, `events/${eventId}`), updates);
        }
    };

    const handleDislike = (eventId) => {
        const user = auth.currentUser;
        if (!user) return;

        const currentEvent = events.find(e => e.id === eventId);
        const currentReaction = currentEvent.reactions?.[user.uid];

        if (currentReaction === 'dislike') {
            const newReactions = { ...(currentEvent.reactions || {}) };
            delete newReactions[user.uid];
            const updates = { reactions: newReactions, dislikes: (currentEvent.dislikes || 0) - 1 };
            update(ref(database, `events/${eventId}`), updates);
        } else {
            const newReactions = { ...(currentEvent.reactions || {}), [user.uid]: 'dislike' };
            const updates = { reactions: newReactions, dislikes: (currentEvent.dislikes || 0) + 1 };
            if (currentReaction === 'like') {
                updates.likes = (currentEvent.likes || 0) - 1;
            }
            update(ref(database, `events/${eventId}`), updates);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    return (
        <div className={isAdminView ? "admin-page" : "post-event-page"}>
            {isAdminView ? <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} /> : <Menubar />}
            <div className={isAdminView ? "post-event-admin-content" : ""}>
                <h2>{isAdminView ? 'Event Posts' : 'Volunteer Events'}</h2>
                <div className="event-list">
                    {events.length > 0 ? (
                        events.map((event) => {
                            const userReaction = event.reactions?.[user?.uid];
                            const hasLiked = userReaction === 'like';
                            const hasDisliked = userReaction === 'dislike';
                            return (
                            <div key={event.id} className="event-card">
                                {event.photo && (
                                    <img
                                        src={event.photo}
                                        alt={event.title}
                                        className="event-photo"
                                    />
                                )}
                                <div className="event-details">
                                    <span className="event-date">🗓️ {new Date(event.date).toDateString()}</span>
                                    <span className="event-location">🌏 {event.location}</span>
                                    <span className="event-title">{event.title}</span>
                                    
                                </div>
                                <div className="event-actions">
                                        <button onClick={() => handleLike(event.id)} className={`like-btn ${hasLiked ? 'active' : ''}`}>👍</button>
                                        <span className="count">({event.likes || 0})</span>
                                        <button onClick={() => handleDislike(event.id)} className={`dislike-btn ${hasDisliked ? 'active' : ''}`}>👎</button>
                                        <span className="count">({event.dislikes || 0})</span>
                                    </div>
                            </div>
                            
                            );
                        })
                    ) : (
                        <p>No events available.</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default PostEvent;
