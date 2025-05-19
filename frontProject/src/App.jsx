import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'

import Login from './pages/Login'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LogInLanding from './pages/LogInLanding'
// import { Route, Routes } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    
    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/loginlanding" element={<LogInLanding/>}/>
      
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
