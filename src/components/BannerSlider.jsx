import React from "react";
import Slider from "react-slick";
import { banners } from "../utilities/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const BannerSlider = () => {
    const settings = {
        centerMode: true,
        centerPadding: "400px",
        slidesToShow: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        arrows: true,
        dots: true,
    };

    return (
        <div className='w-full bg-white py-6'>
            <div className='mx-auto px-4'>
                <Slider {...settings}>
                    {
                        banners.map((banner, i) => (
                            <div key={i} className='px-2'>
                                <img src={banner} alt={`banner-${i}`}
                                className='w-full h-[600px] rounded-xl object-cover' />
                            </div>
                        ))
                    }
                </Slider>
            </div>
        </div>
    )
}

export default BannerSlider;