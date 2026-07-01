import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Interview from './pages/Interview'
import History from './pages/History'
import Login from './pages/Login'
import Navbar from './Navbar'
import CVInterview from './pages/CVInterview'

const App = () => {
  return (
    <div>
      <h1 className="bg-red-500 text-white text-5xl p-10">AI Interviews</h1>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Interview" element={<Interview/>}/>
            <Route path='/history' element={<History/>}/>
            <Route path='/login' element={<Login/>} />
            <Route path='/navbar' element={<Navbar/>}/>
            <Route path='/cv-interview' element={<CVInterview/>} />
        </Routes>
        </BrowserRouter>
      
      
    </div>
  )
}

export default App
