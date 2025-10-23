import React from "react";
import BannerSlider from "./BannerSlider";
import NowShowing from "./NowShowing";
import ComingSoon from "./ComingSoon";

const Home = () => {
    return (
        <div className="">
            <BannerSlider />
            <NowShowing />
            <ComingSoon />
        </div>
    )
}

export default Home