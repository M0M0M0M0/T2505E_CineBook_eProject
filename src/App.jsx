import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import Home from "./pages/Homepage/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetail from "./pages/MovieDetail/MovieDetail.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Offers from "./pages/NewsAndOffers/News&Offers.jsx";
import Theaters from "./pages/TheaterPage/TheaterPage.jsx";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import UserDashboard from "./pages/UserPage/UserDashboard.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import BookingPage from "./pages/BookingPage/BookingPage.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword";

function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <Header />

      {/* <Dashboard /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/theaters" element={<Theaters/> }/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-tickets" element={<UserDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* <Movies /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
