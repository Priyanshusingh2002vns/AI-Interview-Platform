// import axios from 'axios'
import api from "../api";
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    let [tech,setTech]=useState("")

    let [stats,setstats]=useState("")

    const [questionCount ,setQuestionCount]=useState(5)

    const navigation=useNavigate()
    
    const startInterview=()=>{
        if(!tech) return

        navigation(`/interview?tech=${tech}&count=${questionCount}`)
}


const logout=()=>{
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    navigation("/login")
}

 useEffect(()=>{
    
        const token=localStorage.getItem("access")
        api.get("/dashboard_stats/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((res)=>{
            console.log(res.data)
            setstats(res.data)
            
        }).catch((err)=>{
            console.log(err.response?.data)
        })
    },[])
  return (
    <div>
        <h1>Ai-Interview platform</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-blue-500 text-white p-4 rounded">
        <h3>Total</h3>
        <p className="text-2xl font-bold">{stats.total || 0}</p>
    </div>

    <div className="bg-green-500 text-white p-4 rounded">
        <h3>Python</h3>
        <p className="text-2xl font-bold">{stats.python || 0}</p>
    </div>

    <div className="bg-purple-500 text-white p-4 rounded">
        <h3>Django</h3>
        <p className="text-2xl font-bold">{stats.django || 0}</p>
    </div>

    <div className="bg-orange-500 text-white p-4 rounded">
        <h3>React</h3>
        <p className="text-2xl font-bold">{stats.react || 0}</p>
    </div>

    <div className="bg-red-500 text-white p-4 rounded">
        <h3>SQL</h3>
        <p className="text-2xl font-bold">{stats.sql || 0}</p>
    </div>

    <div className="bg-red-500 text-white p-4 rounded">
        <h3>Average Score:</h3>
        <p className="text-2xl font-bold">{Number(stats.avarage_score || 0).toFixed(1)}/10</p>
    </div>
</div>
        <aside>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=> navigation("/history")}>View History</button>
            <br />
            <br />
        </aside>
        <select  name="" value={tech} onChange={(e)=>setTech(e.target.value)} id="">
            <option value="">Select Technology</option>
            <option value="python">Python</option>
            <option value="django">Django</option>
            <option value="react">React</option>
            <option value="sql">SQL</option>
        </select>
        <br />
        <br />

        <input type="number" min="1" max="20" value={questionCount} onChange={(e)=>setQuestionCount(e.target.value)} name="" id="" className='border p-2 rounded' />

        <button onClick={startInterview} className="bg-red-500 text-white px-4 py-2 rounded">START INTERVIEW</button>
        <br />
        <br />

        <button onClick={()=>navigation("/cv-interview")} className="bg-indigo-600 text-white px-4 py-2 rounded">CV INTERVIEW</button>
        <br /><br />

        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded" >Logout</button>
      
    </div>
  )
}

export default Home
