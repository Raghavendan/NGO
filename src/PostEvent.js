// PostEvent.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import "./styles/PostEvent.css"; // Create and style this CSS file
import Navbar from "./Navbar"; // Assuming you have a Navbar

const PostEvent = () => {
    const [events, setEvents] = useState([]);

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

    return (
        <div className="post-event-page">
            <Navbar />
            <h2>Volunteer Events</h2>
            <div className="event-list">
                {events.length > 0 ? (
                    events.map((event) => (
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
                        </div>
                    ))
                ) : (
                    <p>No events available.</p>
                )}
            </div>
        </div>
    );
};

export default PostEvent;
