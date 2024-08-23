import React from 'react';
import './styles/footer.css';
import ico from './assets/icon.jpg'

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <img src={ico} alt="KARPI Logo" className="logo-image" /><br></br>
          <span className='foottit'>KARPI</span>
          <p>Educate Beyond the Books</p>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@karpi.org</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: No. 2A, Second Floor, Vedammal Ave, Dr.Subbaraya Nagar, Kodambakkam, Chennai, Tamil Nadu 600024</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com/karpiorganisation/"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com/karpiorg/"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Karpingo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
