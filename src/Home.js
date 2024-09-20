import React from 'react';
import { useNavigate } from "react-router-dom";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './styles/Home.css';
import Footer from './footer';


import image1 from './assets/1.jpeg';
import image2 from './assets/2.jpeg';
import image3 from './assets/3.png'
import image4 from './assets/4.png';
import paint from './assets/painting.png';
import volunteer from './assets/volunteer.png';
import ser from './assets/service.png';
import overlayImage from './assets/icon.jpg'; // Add your overlay image here
import Navbar from './Navbar';



const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '600px',
  position: 'relative'
};

const blurStyle = {
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1
};

const overlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  color: '#fff'
};



const slideImages = [
  {
    url: image4,
  },
  {
    url: image2,
  },
  {
    url: image3,
  },
  {
    url: image1,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
    <Navbar />

      <div className="slide-container">

        <Slide>
          {slideImages.map((slideImage, index) => (
            <div key={index} style={divStyle}>
              <div style={{ ...blurStyle, backgroundImage: `url(${slideImage.url})` }}></div>
               <div style={overlayStyle}>
                <img src={overlayImage} alt="Overlay" className='logo' />
                <span className='moto'>Educate Beyond The Books</span>
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <div className='conttwo'>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/3045/3045330.png"}></img>
          <span id='txtcont1'>Join as Volunteer</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/7857/7857917.png"}></img>
          <span id='txtcont1'>Works of Karpi</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/6890/6890433.png"}></img>
          <span id='txtcont1'>Credited Donations</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/8382/8382960.png"}></img>
          <span id='txtcont1'>List of Services</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/8799/8799677.png"}></img>
          <span id='txtcont1'>Explore more</span>
        </div>

      </div>
      <Footer/>
      

    </div>
  );
}

export default Home;