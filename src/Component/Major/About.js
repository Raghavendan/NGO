import { useNavigate } from "react-router-dom"
import '../Major/about.css';
import { IoMdMail } from "react-icons/io";
import ico from '../../assets/icon.jpg'
import { MdLocationCity } from "react-icons/md";

import { MdLocalPhone } from "react-icons/md";

function About(){
    const navigate = useNavigate();
    return(
        <>
            <div className="main">
                    <ul class="background">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        
                    </ul>
            
                 
                 <div className="right">
                    <h2>About Us</h2>
                 
                    <div className="rcont">
                        <img src={ico}  className="logo" />
                        <h3>Karpi</h3>
                        <p>Educate Beyond the Books</p>
                            <div className="right_1">
                                <IoMdMail className="icon"/><span>info@karpi.org</span>

                            </div>
                            <div className="right_2">
                                <MdLocalPhone className="icon"/><span>+123 456 7890</span>


                            </div>
                            <div className="right_3" >
                                <MdLocationCity className="icon"/>
                                <p className="add">Kodambakkam,Chennai,Tamil Nadu 600024</p>
                            </div>
                        <div className="social-icons">
                        <a href="https://facebook.com/karpiorganisation/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://instagram.com/karpiorg/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>

                        </div>
                        <p>&copy; 2024 Karpingo. All rights reserved.</p>

                    </div>
                   
                    
                
                </div>
                <div className="left">
                </div>
            </div>
        </>
        
    );
}
export default About;