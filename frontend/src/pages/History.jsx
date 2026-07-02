// import axios from 'axios'
import api from "../api";
import React, { useEffect, useState } from 'react'

const History = () => {
    const [history,setHistory]=useState([])

    useEffect(()=>{
        const token=localStorage.getItem("access")
        api.get("/interview_history/",{headers:{Authorization:`Bearer ${token}`}})
        .then((res) => {
            setHistory(res.data)
        })
    },[])


  return (
  <div className="min-h-screen bg-gray-100 p-8">

    <h1 className="text-4xl font-bold text-center mb-10">
      Interview History
    </h1>

    <div className="max-w-5xl mx-auto">

      {history.map((item) => (

        <div
          key={item.id}
          className="bg-white shadow-md rounded-xl p-6 mb-6"
        >

          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {item.technology}
            </span>
          </div>

          <p className="mb-2">
            <strong>Question:</strong> {item.question}
          </p>

          <p className="mb-4">
            <strong>Your Answer:</strong> {item.answer}
          </p>
          <p><strong>Score:</strong>{item.score}/10</p>

          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">
              {item.feedback}
            </pre>
          </div>

        </div>

      ))}

    </div>

  </div>
)
}

export default History
