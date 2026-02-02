// src/components/HeroCarousel.js

import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Spinner, Alert } from 'react-bootstrap';
import "../../assets/css/mainstyle.css";

// Default values for fields not provided by the API
const defaultStats = [
  { value: "Expert Speaker", label: "Industry Professional" },
  { value: "Date & Time", label: "Upcoming Event" },
  { value: "Venue", label: "Event Location" }
];

const defaultFeatures = [
  { icon: "bi-book-fill", title: "Quality Content", content: "Learn from the best." },
  { icon: "bi-laptop-fill", title: "Modern Resources", content: "Access to latest materials.", active: true },
  { icon: "bi-people-fill", title: "Community", content: "Connect with others." }
];

const defaultEvent = { 
  day: "15", 
  month: "NOV", 
  title: "Upcoming Event", 
  description: "Join us for this exciting event." 
};

function EventCarousel() {
  const [index, setIndex] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch carousel data from API
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch('https://mahadevaaya.com/ngoproject/ngoproject_backend/api/carousel1-item/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform API data to match component structure
          const transformedSlides = data.data.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.sub_title,
            image: `https://mahadevaaya.com/ngoproject/ngoproject_backend${item.image}`,
            stats: defaultStats,
            features: defaultFeatures,
            event: defaultEvent
          }));
          
          setCarouselSlides(transformedSlides);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error("Error fetching carousel data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Show error message if API call fails
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Content</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Show message if no slides are available
  if (carouselSlides.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Content Available</Alert.Heading>
        <p>No carousel slides are currently available.</p>
      </Alert>
    );
  }

  return (
    <>
      {/* The main carousel component from react-bootstrap */}
      <Carousel activeIndex={index} onSelect={handleSelect} interval={5000} pause="hover">
        
        {/* We map over our data array to create a slide for each item */}
        {carouselSlides.map((slide, slideIndex) => (
          <Carousel.Item key={slide.id || slideIndex}>
            {/* Inside each Carousel.Item, we place your hero section structure */}
            <section id="hero" className="hero section hero-area-bg">
              <div className="overlay"></div>
              <div className="hero-wrapper">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-6 hero-content" data-aos="fade-right">
                      <h1>{slide.title}</h1>
                      <p>{slide.subtitle}</p>
                      <div className="stats-row">
                        {slide.stats.map((stat, index) => (
                          <div key={index} className="stat-item">
                            <span className="stat-number">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="action-buttons">
                        <a href="/RegistrationModal" className="btn-primary" >Start Your Journey</a>
                        <a href="#" className="btn-secondary">Virtual Tour</a>
                      </div>
                    </div>
                    <div className="col-lg-6 hero-media" data-aos="zoom-in">
                      <img src={slide.image} alt="Showcase" className="img-fluid" />
                      <div className="image-overlay">
                        <div className="badge-accredited">
                          <i className="bi bi-patch-check-fill"></i>
                          <span>Accredited Excellence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="feature-cards-wrapper" data-aos="fade-up">
                <div className="container">
                  <div className="row gy-4">
                    {slide.features.map((feature, index) => (
                      <div key={index} className="col-lg-4" data-aos="fade-up">
                        <div className={`feature-card ${feature.active ? 'active' : ''}`}>
                          <div className="feature-icon">
                            <i className={`bi ${feature.icon}`}></i>
                          </div>
                          <div className="feature-content">
                            <h3>{feature.title}</h3>
                            <p>{feature.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="upcoming-event" data-aos="fade-up">
                <div className="container">
                  <div className="event-content">
                    <div className="event-date">
                      <span className="day">{slide.event.day}</span>
                      <span className="month">{slide.event.month}</span>
                    </div>
                    <div className="event-info">
                      <h3>{slide.event.title}</h3>
                      <p>{slide.event.description}</p>
                    </div>
                    <div className="event-action">
                      <a href="#" className="btn-event">RSVP Now</a>
                      <span className="countdown">Starts in 3 weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default EventCarousel;