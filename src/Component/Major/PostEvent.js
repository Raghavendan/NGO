import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../Database/firebase";
import "../Major/PostEvent.css";
import Menubar from "../Nav & Foot/menubar";

const PostEvent = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const eventRef = ref(database, "events");
        onValue(eventRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedEvents = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }))
                    .filter((event) => event.title && event.date); // Filter out invalid events
                setEvents(loadedEvents);
            }
        });
    }, []);

    const handleLike = async (eventId) => {
        const eventRef = ref(database, `events/${eventId}`);
        const event = events.find((e) => e.id === eventId);

        if (event) {
            const updatedLikes = (event.likes || 0) + 1; // Increment like count
            await update(eventRef, {
                likes: updatedLikes,
            });

            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.id === eventId ? { ...e, likes: updatedLikes } : e
                )
            );
        }
    };

    const handleDislike = async (eventId) => {
        const eventRef = ref(database, `events/${eventId}`);
        const event = events.find((e) => e.id === eventId);

        if (event) {
            const updatedDislikes = (event.dislikes || 0) + 1; // Increment dislike count
            await update(eventRef, {
                dislikes: updatedDislikes,
            });

            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.id === eventId ? { ...e, dislikes: updatedDislikes } : e
                )
            );
        }
    };

    return (
        <div className="post-event-page">
            <Menubar />
            <h2>Volunteer Events</h2>
            <div className="event-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="event-card">
                            {event.photo && (
                                <img
                                    src={event.photo}
                                    alt={event.title || "Event Image"}
                                    className="event-photo"
                                    onError={(e) => (e.target.src = "/path/to/fallback/image.jpg")}
                                />
                            )}
                            <div className="event-details">
                                <span className="event-date">
                                    🗓️ {event.date ? new Date(event.date).toDateString() : "Invalid Date"}
                                </span>
                                <span className="event-location">🌏 {event.location || "Unknown Location"}</span>
                                <span className="event-title">{event.title || "Untitled Event"}</span>
                            </div>
                            <div className="event-actions">
                                <button
                                    onClick={() => handleLike(event.id)}
                                    className={`act-btn`}
                                >
                                    Like {event.likes || 0}
                                </button>
                                <button
                                    onClick={() => handleDislike(event.id)}
                                    className={`act-btn`}
                                >
                                    Dislike {event.dislikes || 0}
                                </button>
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
