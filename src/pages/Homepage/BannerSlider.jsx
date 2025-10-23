import React from "react";
import Slider from "react-slick";
import { banners } from "../../components/utilities/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BannerSlider = () => {
  const settings = {
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: "150px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "50px",
        },
      },
      {
        breakpoint: 576,
        settings: {
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="container-fluid py-4">
      <div className="mx-auto px-3">
        <Slider {...settings}>
          {banners.map((banner, i) => (
            <div key={i} className="px-2">
              <img
                src={banner}
                alt={`banner-${i}`}
                className="img-fluid rounded-4 shadow-sm"
                style={{
                  height: "600px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;
