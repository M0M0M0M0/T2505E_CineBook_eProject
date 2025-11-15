import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // Import file CSS riêng
import AboutUsImage from './AboutUs.webp';
import { color } from 'framer-motion';
// "About Us" Page Component
export default function AboutUs() {
  return (
    // Thêm class 'about-us-page' để style chung
    <div className="about-us-page">
      {/* Hero/Main Banner Section */}
      {/* Thêm class 'about-hero' */}
      <div className="about-hero container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            {/* You can replace this with an image of a cinema or the team */}
            <img 
              src={AboutUsImage} 
              className="d-block mx-lg-auto img-fluid rounded shadow-sm" 
              alt="About CineBook" 
              width="700" 
              height="500" 
              loading="lazy"
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">Welcome to CineBook</h1>
            <p className="lead">
              CineBook is the leading online movie ticket booking platform, bringing you the simplest, fastest, and most convenient cinema entertainment experience.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Link to="/movies" className="btn btn-primary btn-lg px-4 me-md-2">
                Explore Movies
              </Link>
              <Link to="/theaters" className="btn btn-outline-secondary btn-lg px-4">
                Find Theaters
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      {/* Thêm class 'about-mission' */}
      <div className="about-mission py-5">
        <div className="container px-4 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3">Our Mission</h2>
              <p className="lead">
                CineBook's goal is to revolutionize your movie-going experience. We strive relentlessly to remove all the hassle from buying tickets, helping you focus entirely on what matters most: enjoying great films.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values (Why Choose Us) Section */}
      {/* Thêm class 'about-values' */}
      <div className="about-values container px-4 py-5" id="featured-3">
        <h2 className="pb-2 border-bottom text-center fw-bold">Core Values</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          {/* Thêm class 'about-value-item' */}
          <div className="about-value-item feature col text-center">
            {/* You can add an icon here */}
            <h3 className="fs-4 fw-semibold">Fast & Convenient</h3>
            <p>
              Intuitive, easy-to-use interface. Book tickets successfully in just a few clicks, anytime, anywhere, on any device.
            </p>
          </div>
          {/* Thêm class 'about-value-item' */}
          <div className="about-value-item feature col text-center">
            <h3 className="fs-4 fw-semibold">The Most Options</h3>
            <p>
              We connect with all major theater chains, providing you with the most comprehensive and diverse showtimes all in one place.
            </p>
          </div>
          {/* Thêm class 'about-value-item' */}
          <div className="about-value-item feature col text-center">
            <h3 className="fs-4 fw-semibold">Safe & Secure</h3>
            <p>
              Exclusive offers and a secure payment system with absolute privacy. Enjoy your favorite movie with peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Final Call to Action Section */}
      {/* Thêm class 'about-cta' */}
      <div className="about-cta py-5">
        <div className="container text-center py-5">
          <h2 className="fw-bold mb-3">Ready for your movie?</h2>
          <p className="lead mb-4">
            Don't miss the blockbusters that are waiting.
          </p>
          <Link to="/movies" className="btn btn-primary btn-lg px-5 py-3">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}