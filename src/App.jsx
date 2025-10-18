import { useState } from 'react'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/AdminDashboard.jsx'
import Header from './components/Header.jsx'
import Home from './pages/Homepage/Home.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from './components/Footer.jsx'
import Movies from './pages/Movies/Movies.jsx'
import MovieDetail from './pages/MovieDetail/MovieDetail.jsx'   
import Home from './pages/Homepage/Home.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Header />

      {/* <Dashboard /> */}
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/movies' element={ <Movies /> } />
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
       {/* <Movies /> */}
      <Footer/>


    </BrowserRouter>
  )
}

export default App
