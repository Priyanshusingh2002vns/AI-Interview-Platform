// import axios from 'axios'
import api from "../api";
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")

    const navigate=useNavigate()

    const handleLogin=async () => {

        try{
            
            const res=await api.post( "/token/",
        {
          username,
          password
        })
        localStorage.setItem(
            "access",res.data.access
        )

        localStorage.setItem(
            "refresh",res.data.refresh
        )
        navigate("/")

        }catch(err){
           
            alert("Invalid Credentials")
        }
        
    }



  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">

      <h1 className="text-3xl font-bold text-center mb-6">
        Login
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Login
      </button>

      <p>Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
      </p>

    </div>
  </div>
)
}

export default Login
