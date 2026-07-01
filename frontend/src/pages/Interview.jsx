// import axios from 'axios'
import api from "../api";
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Interview = () => {
    const [params]=useSearchParams()

    let navigate=useNavigate()

    const tech =params.get("tech")

    const totalQuestions=Number(params.get("count"))

    const[question,setQuestion]=useState("")
    const [answer,setAnswer]=useState("")
    const [feedback,setFeedback]=useState("")

    const [loading,setLoading]=useState(false)

    const [currentQuestion,setCurrentQuestion]=useState(1)
    const [completed,setCompleted]=useState(false)

   

    const fetchQuestion=()=>{
        const token=localStorage.getItem("access")

        api.get(`http://127.0.0.1:8000/api/get_question/?tech=${tech}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        }).then((res)=>{
            setQuestion(res.data.question)
        })
    }

    useEffect(()=>{
        fetchQuestion()
    },[])

   

    // useEffect(()=>{

    //     const token=localStorage.getItem("access")
        
    //     axios.get(`http://127.0.0.1:8000/api/get_question/?tech=${tech}`,{headers:{Authorization:`Bearer ${token}`}})
    //     .then((res)=>{
    //         setQuestion(res.data.question)
    //     })
    // },[])

    //  if (completed){
    //     return (
    //         <div>
    //             <h1>🤓🤓🤓 Interview Completed</h1>
    //             <p>Total Questions: {totalQuestions}</p>
    //             <p>Thank you for taking the interview.</p>
    //         </div>
    //     )
    // }

    const submitAnswer =()=>{
        const token=localStorage.getItem("access")

        setLoading(true)


        api.post("http://127.0.0.1:8000/api/evaluate_answer/",{
            technology:tech,
            question,
            answer,
        },{
            headers:{Authorization:`Bearer ${token}`,},}
        ).then((res)=>{
            setFeedback(res.data.feedback)
        }).catch((err)=>{
            console.log(err.response?.data)
        }).finally(()=>{
            setLoading(false)
        })
    }
    const nextQuestion=()=>{
        if(currentQuestion >= totalQuestions){
            setCompleted(true)
            return
        }

        setCurrentQuestion(prev => prev + 1)

        setAnswer("")
        setFeedback("")

        fetchQuestion()
    }
  return (
    <>
    {completed ? (
        <div className="min-h-screen flex flex-col justify-center items-center">
                <h1>🎉 Interview Completed</h1>
                <p>Total Questions: {totalQuestions}</p>

                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Back to Home
                </button>
            </div>
    ):(
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-3xl font-bold mb-6 text-center">
        {tech?.toUpperCase()} Interview
      </h1>

      <h2>Question {currentQuestion}/{totalQuestions}</h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
        <h3 className="text-xl font-semibold">
          {question}
        </h3>
      </div>

      <textarea
        rows="6"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer here..."
        className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={submitAnswer}
        disabled={loading || feedback}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Evaluating..." : "Submit Answer"}
      </button>

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {feedback && (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl border">
          <h2 className="text-2xl font-bold mb-4">
            AI Feedback
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {feedback}
          </pre>

          {currentQuestion < totalQuestions ? (
            <button onClick={nextQuestion} className="bg-green-500 text-white px-4 py-2 rounded">Next Question</button>
          ):(
            <button onClick={()=>setCompleted(true)} className="bg-purple-500 text-white px-4 py-2 rounded"  >Finish interview</button>
          )
          }

            
         </div>
      )}

    </div>
    )}

    </>
  
)
}

export default Interview
