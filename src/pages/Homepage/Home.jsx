import React from "react";
import BannerSlider from "../../components/BannerSlider";
import NowShowing from "../../components/NowShowing";
import ComingSoon from "../../components/ComingSoon";

const Home = () => {
    return (
        <div>
            <BannerSlider />
            <NowShowing />
            <ComingSoon />
        </div>
    )
}

export default Home