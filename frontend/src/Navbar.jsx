import { Link } from "react-router-dom"

function Navbar(){
  return(
    <div className="bg-gray-900 text-white p-4 flex justify-between">

      <h1 className="font-bold">
        AI Interview
      </h1>

      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/history">History</Link>
      </div>

    </div>
  )
}

export default Navbar