import ico from '../../assets/icon.jpg';
import vis from '../../assets/vision.png';
import mis from '../../assets/mission.jpg';
import './About.css';

function About() {
    return (
        <>
            <div className="about-content">
                <div className="about-image-section">
                    <img src={ico} alt="KARPI Logo" className="about-image" />
                    <h2>KARPI</h2>

                </div>
                <div className="about-info-section">
                    {/* <div className="info-title">
                        <h2>KARPI</h2>
                    </div> */}
                    <div className="info-mission">
                        <h4>Our Mission</h4>
                        <div className="mission-content">
                            <img src={mis} alt="Mission" className="info-img" />

                            <p>Educate Beyond the Books</p>
                        </div>
                    </div>
                    <div className="info-vision">
                        <h4>Our Vision</h4>
                        <div className="vision-content">
                            <img src={vis} alt="Vision" className="info-img" />
                            <p>KARPI is dedicated to educating beyond the traditional classroom, fostering holistic development and lifelong learning.</p>
                        </div>
                    </div>
                    <div className="info-contact">
                        <h4>Contact Us</h4>
                        <p><span>📧 Email: info@karpi.org</span> <span>📞 Phone: +123 456 7890</span></p>
                        <p className="add">🌏 Address: No. 2A, Second Floor, Vedammal Ave, Dr.Subbaraya Nagar, Kodambakkam, Chennai, Tamil Nadu 600024 <a href="https://maps.google.com/?q=No.+2A,+Second+Floor,+Vedammal+Ave,+Dr.Subbaraya+Nagar,+Kodambakkam,+Chennai,+Tamil+Nadu+600024" target="_blank" rel="noreferrer">Location here</a></p>
                        <iframe src="https://maps.google.com/maps?q=No.+2A,+Second+Floor,+Vedammal+Ave,+Dr.Subbaraya+Nagar,+Kodambakkam,+Chennai,+Tamil+Nadu+600024&output=embed&maptype=satellite" width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy" title="Satellite View"></iframe>
                    </div>
                    <div className="info-follow">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="https://facebook.com/karpiorganisation/">karpiorganisation<i className="fab fa-facebook-f"></i></a>
                            <a href="https://twitter.com">ngokarpi<i className="fab fa-twitter"></i></a>
                            <a href="https://instagram.com/karpiorg/">karpiorg<i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;