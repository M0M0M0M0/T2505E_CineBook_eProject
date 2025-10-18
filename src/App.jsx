import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/News&Offers.css";
import Dashboard from "./pages/AdminDashboard.jsx";

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
      </Routes>
      {/* <Movies /> */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
