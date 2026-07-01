import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from "../api"
const Register = () => {
    let navigate=useNavigate()

    const [formData,setFormData]=useState({
        username:"",
        email:"",
        password:"",
    })

    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")

    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value,})
    }

    async function handleSubmit(e){
        e.preventDefault()

        setError("");
        setSuccess("");

        try {
            const res=await api.post("/register/",formData)

            setSuccess(res.data.message)

            setTimeout(()=>{
                navigate("/login")
            },1500)
        } catch (err){
            setError(
                err.response?.data?.error || "Registration Failed"
            )
        }
    }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" name="username" className="w-full border p-3 rounded mb-4" value={formData.username} onChange={handleChange} id="" />

                <input type="email" name="email" placeholder='Email' className="w-full border p-3 rounded mb-4" value={formData.email} onChange={handleChange}  id="" />

                <input type="password" name="password" placeholder='Password' className="w-full border p-3 rounded mb-4" value={formData.password} onChange={handleChange}  id="" />

                <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"> Register </button>
            </form>
            {error && (
                <p className="text-green-600 mt-4">{error}</p>
            )}
            {success && (
                <p className="text-green-600 mt-4">{success}</p>
            )}
            <p className="mt-6 text-center">Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
            </p>
        </div>
      
    </div>
  )
}

export default Register
