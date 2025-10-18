import { useState } from 'react'
import './App.css'
import './assets/css/News&Offers.css'
import Dashboard from './pages/AdminDashboard.jsx'
import Offers from './pages/News&Offers.jsx'
import Theaters from './pages/TheaterPage.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Dashboard />
      <Offers />
      <Theaters />
    </>

  )
}

export default App
