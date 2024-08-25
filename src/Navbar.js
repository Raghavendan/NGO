import './styles/App.css';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import ico from "./assets/icon.jpg";
import { FaBars, FaTimes, FaUserShield, FaUserFriends, FaUserCircle } from "react-icons/fa";

function Navbar() {
	const navRef = useRef();
	const navigate = useNavigate();

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
		
	};
	const handleSignupClick = () => {
		navigate('/signup'); // Navigate to the signup page
	  };
	const admin = () => {
		navigate('/admin'); 
	};


	return (
		<header>
			<img src={ico} alt="KARPI Logo" className="logo-image" />
			<h3 className="logoname">KARPI</h3>
			<nav ref={navRef}>
				<a href="/">Home</a>
				<a href="/event">Event</a>
				<a href="/chat">Chat</a>
                <a href="/donate">Donate</a>
				<a href="/abt">About</a>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<div className='parentbtn'>
			<div className="icon-buttons">
				<button className="icon-btn" >
					<FaUserShield title="Admin" id='faicon' onClick={admin}/>
				</button>
				<button className="icon-btn" id='faicon' onClick={handleSignupClick}>
					<FaUserFriends title="Volunteer" />
				</button>
				
			</div>
			</div>
			
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}

export default Navbar;
