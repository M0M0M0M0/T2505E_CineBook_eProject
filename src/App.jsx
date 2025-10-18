import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/AdminDashboard.jsx'
import Header from './components/Header.jsx'
import Home from './pages/Homepage/Home.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from './components/Footer.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Header />
      <Dashboard />
      <Home/>
    </BrowserRouter>
  )
}

export default App
