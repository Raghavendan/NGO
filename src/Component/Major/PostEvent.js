// PostEvent.js
import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database, auth } from "../Database/firebase";
import "../Major/PostEvent.css"; // Create and style this CSS file
import Menubar from "../Nav & Foot/menubar"; // Assuming you have a Navbar

const PostEvent = () => {
    const [events, setEvents] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        const eventRef = ref(database, 'events');
        
        // Listen for changes in the 'events' node
        onValue(eventRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedEvents = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setEvents(loadedEvents);
            }
        });
    }, []);

    const handleLike = (eventId) => {
        const user = auth.currentUser;
        if (!user) return; // Not logged in

        const currentEvent = events.find(e => e.id === eventId);
        const currentReaction = currentEvent.reactions?.[user.uid];

        if (currentReaction === 'like') {
            // Remove like
            const newReactions = { ...(currentEvent.reactions || {}) };
            delete newReactions[user.uid];
            const updates = { reactions: newReactions, likes: (currentEvent.likes || 0) - 1 };
            update(ref(database, `events/${eventId}`), updates);
            setEvents(events.map(e => e.id === eventId ? { ...e, ...updates } : e));
        } else {
            // Add like, remove dislike if any
            const newReactions = { ...(currentEvent.reactions || {}), [user.uid]: 'like' };
            const updates = { reactions: newReactions, likes: (currentEvent.likes || 0) + 1 };
            if (currentReaction === 'dislike') {
                updates.dislikes = (currentEvent.dislikes || 0) - 1;
            }
            update(ref(database, `events/${eventId}`), updates);
            setEvents(events.map(e => e.id === eventId ? { ...e, ...updates } : e));
        }
    };

    const handleDislike = (eventId) => {
        const user = auth.currentUser;
        if (!user) return; // Not logged in

        const currentEvent = events.find(e => e.id === eventId);
        const currentReaction = currentEvent.reactions?.[user.uid];

        if (currentReaction === 'dislike') {
            // Remove dislike
            const newReactions = { ...(currentEvent.reactions || {}) };
            delete newReactions[user.uid];
            const updates = { reactions: newReactions, dislikes: (currentEvent.dislikes || 0) - 1 };
            update(ref(database, `events/${eventId}`), updates);
            setEvents(events.map(e => e.id === eventId ? { ...e, ...updates } : e));
        } else {
            // Add dislike, remove like if any
            const newReactions = { ...(currentEvent.reactions || {}), [user.uid]: 'dislike' };
            const updates = { reactions: newReactions, dislikes: (currentEvent.dislikes || 0) + 1 };
            if (currentReaction === 'like') {
                updates.likes = (currentEvent.likes || 0) - 1;
            }
            update(ref(database, `events/${eventId}`), updates);
            setEvents(events.map(e => e.id === eventId ? { ...e, ...updates } : e));
        }
    };

    return (
        <div className="post-event-page">
            <Menubar />
            <h2>Volunteer Events</h2>
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
    );
};

export default PostEvent;
