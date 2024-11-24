import React from 'react'
import './Unauthorized.scss'
import { Link } from 'react-router-dom'
const Unauthorized = () => {
  return (
    <div className={`container-fluid d-flex justify-content-center align-items-center body`}>
        <div className={`d-flex flex-column justify-content-center align-items-center`}>
            <h1 className={`fw-bold text-white py-0 my-0 status`}>401</h1>
            <h2 className={`fw-bold text-white py-0 mb-3 notfound`}>Unauthorized Link</h2>
            <p className="text-white fs-5 mb-4 text-center w-75">It seems that that the link you want to access is unauthorized for security purpose</p>
            <Link to="/dashboard/data/provider" className={`text-decoration-none bg-light text-black d-flex justify-content-center align-items-center link-back`}>Back To Home</Link>
        </div>
    </div>
  )
}

export default Unauthorized