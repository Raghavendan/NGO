import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { MdLogout, MdAdd, MdArticle, MdPeople, MdPalette, MdAttachMoney, MdMenu, MdClose, MdHome } from 'react-icons/md';
import { IoIosChatbubbles } from "react-icons/io";
import { FaUser } from 'react-icons/fa';

function Sidebar({ isOpen, onToggle }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { adminName } = location.state || {};

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(window.innerWidth <= 1024);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const home = () => {
        navigate('/adminhome');
    };
    
    const Services = () => {
        navigate('/');
    };
    const createEvent = () => {
        navigate('/event');
    };
    const posts = () => {
        navigate('/post', { state: { from: 'admin' } });
    };
    const groupChat = () => {
        navigate('/chat', { state: { from: 'admin' } });
    };
    const manageVolunteers = () => {
        navigate('/manage-volunteers');
    };
    const paintings = () => {
        navigate('/paintings');
    };
    const donations = () => {
        navigate('/donations');
    };
    const logout = () => {
        navigate('/admin');
    };

    const toggleSidebar = () => {
        if (isMobile) {
            onToggle();
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${isMobile ? (isOpen ? 'open' : '') : ''}`}>
            <div className='sidebar-header'>
                <button className='toggle-btn' onClick={toggleSidebar}>
                    {isCollapsed ? <MdMenu /> : <MdClose />}
                </button>
            </div>
            <div className='sidebar-menu'>
                <div className='submenu-item' onClick={home}>
                    <MdHome className='submenu-icon' />
                    {!isCollapsed && <span>Home</span>}
                </div>
                <div className='menu-item'>
                    {!isCollapsed && <div className='menu-header'>
                        <span className='menu-text'>Event</span>
                    </div>}
                    <div className='submenu'>
                        <div className='submenu-item' onClick={createEvent}>
                            <MdAdd className='submenu-icon' />
                            {!isCollapsed && <span>Create Event</span>}
                        </div>
                        <div className='submenu-item' onClick={posts}>
                            <MdArticle className='submenu-icon' />
                            {!isCollapsed && <span>Posts</span>}
                        </div>
                    </div>
                </div>
                <div className='menu-item'>
                    {!isCollapsed && <div className='menu-header'>
                        <span className='menu-text'>Chat</span>
                    </div>}
                    <div className='submenu'>
                        <div className='submenu-item' onClick={groupChat}>
                            <IoIosChatbubbles className='submenu-icon' />
                            {!isCollapsed && <span>Group Chat</span>}
                        </div>
                    </div>
                </div>
                <div className='menu-item'>
                    {!isCollapsed && <div className='menu-header'>
                        <span className='menu-text'>Services</span>
                    </div>}
                    <div className='submenu'>
                        <div className='submenu-item' onClick={manageVolunteers}>
                            <MdPeople className='submenu-icon' />
                            {!isCollapsed && <span>Manage Volunteers</span>}
                        </div>
                        <div className='submenu-item' onClick={paintings}>
                            <MdPalette className='submenu-icon' />
                            {!isCollapsed && <span>Paintings</span>}
                        </div>
                        <div className='submenu-item' onClick={donations}>
                            <MdAttachMoney className='submenu-icon' />
                            {!isCollapsed && <span>Donations</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='admin-profile'>
                    <FaUser className='profile-icon' />
                    {!isCollapsed && <div className='profile-info'>
                        <span>{adminName || 'Admin'}</span>
                        <span>Administrator</span>
                    </div>}
                </div>
                <div className='logout-button' onClick={logout}>
                    <MdLogout className='logout-icon' />
                    {!isCollapsed && <span>Logout</span>}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;