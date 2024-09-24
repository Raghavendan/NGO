import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./Event.css";
import Navbar from "../Nav & Foot/Navbar";
import { database, ref, push } from "../Database/firebase";
import AlertModal from "../Dialog box/AlertModal";

const Event = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState("");
    const [events, setEvents] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [location, setLocation] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const Date_Click_Fun = (date) => {
        setSelectedDate(date);
    };

    const Event_Data_Update = (event) => {
        setEventName(event.target.value);
    };

    const Photo_Upload_Fun = (event) => {
        if (event.target.files && event.target.files[0]) {
            setPhoto(event.target.files[0]);
        }
    };

    const Location_Data_Update = (event) => {
        setLocation(event.target.value);
    };

    const Create_Event_Fun = () => {
        if (selectedDate && eventName) {
            let newPhotoUrl = null;

            if (photo && (photo instanceof File || photo instanceof Blob)) {
                newPhotoUrl = URL.createObjectURL(photo);
            }

            const newEvent = {
                id: new Date().getTime(),
                date: selectedDate,
                title: eventName,
                photo: newPhotoUrl,
                location: location,
            };

            setEvents([...events, newEvent]);
            setPhotoUrl(newPhotoUrl);
            setSelectedDate(null);
            setEventName("");
            setPhoto(null);
            setLocation("");
        }
    };

    const Post_Events_To_Firebase = () => {
        events.forEach((event) => {
            const eventRef = ref(database, 'events');
            push(eventRef, {
                id: event.id,
                date: event.date.toISOString(),
                title: event.title,
                photo: event.photo,
                location: event.location,
            });
            setShowAlert(true);
        });
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [photoUrl]);

    const Update_Event_Fun = (id, newTitle) => {
        if (newTitle) {
            const updatedEvents = events.map((event) =>
                event.id === id ? { ...event, title: newTitle } : event
            );
            setEvents(updatedEvents);
        }
    };

    const Delete_Event_Fun = (id) => {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
    };

    return (
        <div className="app">
            <Navbar />
            <div className="main-container">
                <div className="calendar-and-event">
                    <div className="calendar-container">
                        <Calendar
                            value={selectedDate}
                            onClickDay={Date_Click_Fun}
                            tileClassName={({ date }) =>
                                selectedDate &&
                                date.toDateString() === selectedDate.toDateString()
                                    ? "selected"
                                    : events.some(
                                          (event) =>
                                              new Date(event.date).toDateString() ===
                                              date.toDateString(),
                                      )
                                    ? "event-marked"
                                    : ""
                            }
                        />
                    </div>
                    <div className="event-container">
                        <div className="event-form">
                            <h2 className="ef-name" id="sh">Create Event</h2>
                            <p className="sh_txt">
                                Selected Date:{" "}
                                {selectedDate ? selectedDate.toDateString() : "None"}
                            </p>
                            <input id="input"
                                type="text"
                                placeholder="Event Name"
                                value={eventName}
                                onChange={Event_Data_Update}
                            />
                            <input id="input" type="file" onChange={Photo_Upload_Fun} />
                            <input id="input"
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={Location_Data_Update}
                            />
                            <button id="input"
                                className="create-btn"
                                onClick={Create_Event_Fun}
                            >
                                Click Here to Add Event
                            </button>
                        </div>
                    </div>
                </div>
                <div className="Created-event">
                 <h2 className="el-name" id="sh">My Created Event List</h2>

                    {events.length > 0 && (
                        
                        <div className="event-list">
                            <div className="event-cards">
                                {events.map((event) => (
                                    <div key={event.id} className="event-card">
                                        <div className="event-card-body">
                                            {event.photo && (
                                                <img
                                                    src={event.photo}
                                                    alt={event.title}
                                                    className="event-photo"
                                                />
                                            )}
                                            <div className="event-card-header">
                                                <span className="event-date">
                                                    🗓️{new Date(event.date).toDateString()}
                                                </span>
                                                <span className="event-location">
                                                🌏{event.location}
                                                </span>
                                                <span className="event-title">
                                                {event.title}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="event-actions">
                                            <button
                                                className="update-btn"
                                                onClick={() =>
                                                    Update_Event_Fun(
                                                        event.id,
                                                        prompt(
                                                            "ENTER NEW TITLE",
                                                        ),
                                                    )
                                                }
                                            >
                                                Update Event
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    Delete_Event_Fun(event.id)
                                                }
                                            >
                                                Delete Event
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                           
                        </div>
                        
                    )}
                     <div className="parent-container">
                                <button className="post-btn" onClick={Post_Events_To_Firebase}>Post</button>
                                {showAlert && (
                                    <AlertModal
                                        message="Successfully posted the event!"
                                        onClose={handleCloseAlert}
                                    />
                                )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
