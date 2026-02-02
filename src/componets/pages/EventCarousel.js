// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Spinner, Alert } from 'react-bootstrap';
import "../../assets/css/mainstyle.css";

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
            image: `https://mahadevaaya.com/ngoproject/ngoproject_backend${item.image}`
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
                     
                    </div>
                    <div className="col-lg-6 hero-media" data-aos="zoom-in">
                      <img src={slide.image} alt="Showcase" className="img-fluid" />
                      <div className="image-overlay">
                       
                      </div>
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