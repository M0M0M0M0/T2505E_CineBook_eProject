import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css";
import { PrevArrow, NextArrow } from "../../components/SliderArrow";

const BannerSlider = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.slice(-5))) 
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 1,
    arrows: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 800,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="banner-slider-container">
      <Slider {...settings} className="banner-slider">
        {movies.map((movie) => (
          <div key={movie.movie_id}>
            <img
              src={movie.backdrop_path}
              alt={movie.title}
              className="img-fluid"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
