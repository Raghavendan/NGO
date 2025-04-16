import React, { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../Database/firebase';
import AlertModal from '../Dialog box/AlertModal'; // adjust path if needed
import './ManVolunteer.css';

function ManVolunteer() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const volunteerRef = ref(database, 'Volunteers/');

    onValue(volunteerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const volunteerList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setVolunteers(volunteerList);
      }
    });
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedVolunteerId(id);
    setModalMessage("Are you sure you want to delete this volunteer?");
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    const userRef = ref(database, `Volunteers/${selectedVolunteerId}`);
    remove(userRef)
      .then(() => {
        setModalMessage("Volunteer deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting volunteer:", error);
        setModalMessage("Failed to delete volunteer.");
      })
      .finally(() => {
        setTimeout(() => {
          setModalVisible(false);
          setSelectedVolunteerId(null);
        }, 1500); // close modal after showing success or failure
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedVolunteerId(null);
  };

  return (
    <div className="volunteer-container">
      <h2>Volunteer Profiles</h2>
      <div className="volunteer-grid">
        {volunteers.map((vol) => (
          <div key={vol.id} className="volunteer-card">
            <img src={vol.photoUrl || "https://via.placeholder.com/100"} alt="Profile" className="profile-pic" />
            <h3>{vol.username || "No Name"}</h3>
            <p><strong>✉️</strong> {vol.email || "N/A"}</p>
            <p><strong>☎️</strong> {vol.mobile || "N/A"}</p>
            <button className="delete-btn" onClick={() => handleDeleteClick(vol.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Alert Modal with OK and Cancel */}
      {modalVisible && (
        <AlertModal
          show={modalVisible}
          message={modalMessage}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default ManVolunteer;
