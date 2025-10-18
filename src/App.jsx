import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/AdminDashboard.jsx'
import Header from './components/Header.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from './components/Footer.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Header />
      <Dashboard />
      
    </BrowserRouter>
  )
}

export default App
