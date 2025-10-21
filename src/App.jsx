import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/News&Offers.css";
import Dashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import Home from "./pages/Homepage/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetail from "./pages/MovieDetail/MovieDetail.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Offers from "./pages/News&Offers.jsx";
import Theaters from "./pages/TheaterPage.jsx";

function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <Header />

      {/* <Dashboard /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/theaters" element={<Theaters/> }/>
      {/* <Movies /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
