import React, { useState, useEffect } from 'react';
import { database, storage } from '../Database/firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ManageVolunteers.css';
import Sidebar from '../Nav & Foot/Sidebar';
import defaultAvatar from '../../assets/icon.jpg'; // Default avatar

function ManageVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', phone: '', photoUrl: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);


    useEffect(() => {
        const volunteersRef = ref(database, 'Volunteers');
        onValue(volunteersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedVolunteers = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setVolunteers(loadedVolunteers);
            } else {
                setVolunteers([]);
            }
        });

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if(window.innerWidth > 768){
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const uploadImage = async () => {
        if (!selectedFile) return formData.photoUrl || ''; // Return existing URL if no new file
        const imageRef = storageRef(storage, `volunteer_profiles/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(imageRef, selectedFile);
        return await getDownloadURL(imageRef);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const photoUrl = await uploadImage();
        const volunteerData = { ...formData, photoUrl };

        if (isEditing) {
            const volunteerRef = ref(database, `Volunteers/${isEditing.id}`);
            update(volunteerRef, volunteerData);
        } else {
            push(ref(database, 'Volunteers'), volunteerData);
        }
        resetForm();
    };

    const handleDeleteVolunteer = (id) => {
        if (window.confirm('Are you sure you want to delete this volunteer?')) {
            const volunteerRef = ref(database, `Volunteers/${id}`);
            remove(volunteerRef);
        }
    };

    const startEditing = (volunteer) => {
        setIsEditing(volunteer);
        setFormData({ 
            username: volunteer.username, 
            email: volunteer.email, 
            phone: volunteer.phone || '',
            photoUrl: volunteer.photoUrl || ''
        });
        setPreviewUrl(volunteer.photoUrl || '');
    };

    const resetForm = () => {
        setIsAdding(false);
        setIsEditing(null);
        setFormData({ username: '', email: '', phone: '', photoUrl: '' });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-page">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <div className="manage-volunteers-content">
                <h1>Manage Volunteers</h1>
                <button onClick={() => { setIsAdding(true); setIsEditing(null); resetForm(); }} className="add-btn">Add New Volunteer</button>

                {(isAdding || isEditing) && (
                    <div className="form-modal">
                        <form onSubmit={handleSubmit}>
                            <h2>{isEditing ? 'Edit Volunteer' : 'Add Volunteer'}</h2>
                            {previewUrl && <img src={previewUrl} alt="Preview" className="avatar-preview" />}
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" required />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" />
                            <div className="form-buttons">
                                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
                                <button type="button" onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="volunteers-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Profile Picture</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.map(v => (
                                <tr key={v.id}>
                                    <td><img src={v.photoUrl || defaultAvatar} alt={v.username} className="volunteer-avatar" /></td>
                                    <td>{v.username}</td>
                                    <td>{v.email}</td>
                                    <td>{v.phone}</td>
                                    <td>
                                        <button onClick={() => startEditing(v)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteVolunteer(v.id)} className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageVolunteers;
