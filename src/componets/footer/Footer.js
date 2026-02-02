import React, { useState } from 'react';
import "../../assets/css/mainstyle.css"
import { Link } from 'react-router-dom';
import EventLogo from '../../assets/images/br-event-logo.png'
import { Container } from 'react-bootstrap';

function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <footer id="footer" className="footer position-relative light-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link to="/" className="logo d-flex align-items-center">
              <img src={EventLogo} alt="logo" className="logo-wecd" />
              <span className="sitename">NGO Events</span>
            </Link>
            <div className="footer-contact pt-3">
              <p>A108 Adam Street</p>
              <p>New York, NY 535022</p>
              <p className="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
              <p><strong>Email:</strong> <span>info@example.com</span></p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="#"><i className="bi bi-twitter-x"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/AboutUs">About Us</Link></li>
              <li><Link to="/DonationSociety">Donations</Link></li>
              <li><Link to="/Activity">Activity</Link></li>
              <li><Link to="/AssociatedWings">Associated Wings</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Registration</h4>
            <ul>
              <li><Link to="/Registration">Member Registration</Link></li>
              <li><Link to="/MembersList">Members List</Link></li>
              <li><Link to="/Login">Login</Link></li>
              <li><Link to="#">Terms of service</Link></li>
              <li><Link to="#">Privacy policy</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Events</h4>
            <ul>
              <li><Link to="#">Upcoming Events</Link></li>
              <li><Link to="#">Past Events</Link></li>
              <li><Link to="#">Event Calendar</Link></li>
              <li><Link to="#">Event Gallery</Link></li>
              <li><Link to="#">Event Reports</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Contact</h4>
            <ul>
              <li><Link to="#">Get in Touch</Link></li>
              <li><Link to="#">Support</Link></li>
              <li><Link to="#">FAQ</Link></li>
              <li><Link to="#">Volunteer</Link></li>
              <li><Link to="#">Partnerships</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">NGO Events</strong> <span>All Rights Reserved</span></p>
        <div className="credits">
          Designed by <a href="https://bootstrapmade.com/">Brainrock</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;