import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import Home from "./pages/Homepage/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import ComingSoon from "./pages/Movies/ComingSoon.jsx";
import MovieDetail from "./pages/MovieDetail/MovieDetail.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Offers from "./pages/NewsAndOffers/News&Offers.jsx";
import Theaters from "./pages/TheaterPage/TheaterPage.jsx";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";

import ForgotPassword from "./pages/Auth/ForgotPassword";
import PendingBookingDialog from "./components/PendingBookingDialog.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import AboutUs from "./pages/FooterPage/AboutUs.jsx";
import SiteMap from "./pages/FooterPage/SiteMap.jsx";
import HelpCenter from "./pages/FooterPage/HelpCenter.jsx";
import ContactUs from "./pages/FooterPage/ContactUs.jsx";
import Career from "./pages/FooterPage/Career.jsx";
import Terms from "./pages/FooterPage/Terms.jsx";
import Privacy from "./pages/FooterPage/Privacy.jsx";
function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <PendingBookingDialog />
      <Header />

      {/* <Dashboard /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
