import { useState } from 'react'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import './App.css'
import './assets/css/News&Offers.css'
import Dashboard from './pages/AdminDashboard.jsx'


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Dashboard />
    </>
  )
}

export default App
