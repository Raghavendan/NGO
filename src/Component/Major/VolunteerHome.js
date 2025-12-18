import React, { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { FaCaretSquareDown, FaCaretSquareUp } from 'react-icons/fa';
import '../Major/Home.css';
import Footer from '../Nav & Foot/footer';

import image1 from '../../assets/1.webp';
import image2 from '../../assets/2.webp';
import image3 from '../../assets/3.webp';
import image4 from '../../assets/4.webp';

import e1 from '../../assets/element_1.png';
import e2 from '../../assets/element_2.png';
import e3 from '../../assets/element_3.png';
import e4 from '../../assets/element_4.png';


import overlayImage from '../../assets/icon.jpg'; // Add your overlay image here
import Menubar from '../Nav & Foot/menubar';

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
  { url: image4 },
  { url: image2 },
  { url: image3 },
  { url: image1 },
];

const galleryImages = [
  { url: image4 },
  { url: image2 },
  { url: image3 },
  { url: image1 },
  { url: image4 },
  { url: image2 },
  { url: image3 },
  { url: image1 },
];

const Vhome = () => {

  // State to manage showing more images
  const [showMore, setShowMore] = useState(false);

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div>
      <Menubar />

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
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/3045/3045330.png"} alt="Volunteer" />
          <span id='txtcont1'>Join as Volunteer</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/7857/7857917.png"} alt="Works" />
          <span id='txtcont1'>Works of Karpi</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/6890/6890433.png"} alt="Donations" />
          <span id='txtcont1'>Credited Donations</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/8382/8382960.png"} alt="Services" />
          <span id='txtcont1'>List of Services</span>
        </div>
        <div id='conttwo1'>
          <img id='imgcont1' src={"https://cdn-icons-png.flaticon.com/128/8799/8799677.png"} alt="Explore" />
          <span id='txtcont1'>Explore more</span>
        </div>
      </div>

      {/* New Gallery Section */}
      <span className='gallery-title'>Gallery</span>

      <div className="gallery-container">
        {galleryImages.slice(0, 5).map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image.url} alt={`Gallery ${index + 1}`} className="gallery-img" />
          </div>
        ))}

        {/* Show more images if the button is clicked */}
        {showMore && galleryImages.slice(5).map((image, index) => (
          <div key={index + 5} className="gallery-item">
            <img src={image.url} alt={`Gallery ${index + 6}`} className="gallery-img" />
          </div>
        ))}
      </div>

      {/* Button to show/hide more images */}
      <div className="show-more-container">
      <button className="show-more-btn" onClick={handleShowMore}>
          {showMore ? (
            <>
              Show Less <FaCaretSquareUp className='icon' />
            </>
          ) : (
            <>
              Show More <FaCaretSquareDown className='icon' />
            </>
          )}
        </button>

      </div>
      <div className='elements'>
          <div className='element'>
            <img src={e1} alt='Environmental Stewardship'/>
            <div className="text-container">
              <span>Environmental Stewardship</span>
              <p>Environmental stewardship refers to the responsible management and protection of the natural environment through sustainable practices and conservation efforts. It involves individuals, organizations, and communities taking proactive measures to minimize their ecological footprint, preserve natural resources, and promote biodiversity</p>
            </div>
          </div>

        <div className='element'>
          <img src={e2} alt='Extracurricular'></img>
          <div className="text-container">
              <span>Extracurricular</span>
              <p>Extracurricular activities play a vital role in the holistic development of students, complementing their formal education. They provide opportunities for students to explore interests beyond the classroom, such as sports, arts, music, and leadership programs. By participating in these activities, students enhance their social skills, build teamwork and leadership abilities, and develop a sense of responsibility, ultimately fostering well-rounded individuals prepared for future challenges.</p>
          </div>
        </div>
        <div className='element'>
          <img src={e3} alt='Fundraising'></img>
          <div className="text-container">
              <span>Fundraising</span>
              <p>Fundraising is crucial for sustaining the operations of an education-based NGO, enabling it to provide essential resources and services to its target communities. This can be achieved through various methods, including grant applications, online crowdfunding campaigns, corporate sponsorships, and community events. Effective fundraising strategies not only generate financial support but also raise awareness about the organization's mission, engage supporters, and build long-term partnerships within the community.</p>
          </div>
        </div>
        <div className='element'>
          <img src={e4} alt='Community Involvement'></img>
          <div className="text-container">
              <span>Community Involvement</span>
              <p>Community involvement is essential for the success of an education-based NGO, as it fosters local ownership and engagement in educational initiatives. By actively involving community members in decision-making, program implementation, and volunteer opportunities, the NGO builds trust and strengthens relationships. This collaborative approach not only enhances the relevance of educational programs but also empowers the community to take charge of their own development.</p>
          </div>
        </div>



      </div>

      <Footer />
    </div>
  );
};

export default Vhome;
