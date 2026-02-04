// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import "../../assets/css/mainstyle.css";
import "../../assets/css/AnimatedCarousel.css";

function EventCarousel() {
  const [index, setIndex] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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

  // Seamless transition logic
  const [prevSlideIndex, setPrevSlideIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (carouselSlides.length === 0) return;

    const interval = setInterval(() => {
      setPrevSlideIndex(activeSlideIndex);
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSlideIndex(prevIndex => (prevIndex + 1) % carouselSlides.length);
        setIsTransitioning(false);
      }, 1200); // 1.2s overlap for fade
    }, 20000); // 20s per image

    return () => clearInterval(interval);
  }, [carouselSlides.length, activeSlideIndex]);

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
    <div className="hero-carousel-container hero">
      {/* Animated Background Slides */}
      <div className="carousel-background">
        {/* Current slide */}
        {carouselSlides[activeSlideIndex] && (
          <div
            key={carouselSlides[activeSlideIndex].id}
            className={`carousel-background-slide active${isTransitioning ? ' fade-out' : ''}`}
            style={{ backgroundImage: `url('${carouselSlides[activeSlideIndex].image}')` }}
            role="img"
            aria-label={carouselSlides[activeSlideIndex].title}
          />
        )}
        {/* Next slide (fade in) */}
        {isTransitioning && carouselSlides[(activeSlideIndex + 1) % carouselSlides.length] && (
          <div
            key={carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].id + '-next'}
            className="carousel-background-slide fade-in"
            style={{ backgroundImage: `url('${carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].image}')` }}
            role="img"
            aria-label={carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].title}
          />
        )}
      </div>

      {/* Semi-transparent overlay for text readability */}
      <div className="carousel-overlay"></div>

      {/* Content Wrapper */}
      <div className="hero-wrapper">
        <div className="container">
          <div className="row align-items-center">
            {/* Text Content - Only show current slide content */}
            <div className="col-lg-6 hero-content" data-aos="fade-right">
              <h1>{carouselSlides[activeSlideIndex]?.title}</h1>
              <p>{carouselSlides[activeSlideIndex]?.subtitle}</p>
            </div>

            {/* Empty space or additional content on larger screens */}
            <div className="col-lg-6 hero-media" data-aos="zoom-in">
              {/* Optional: Add decorative elements or statistics here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCarousel;