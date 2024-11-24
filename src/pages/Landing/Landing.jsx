import React, {useEffect, useState } from 'react';
import './Landing.scss';
import LandingImage from "../../assets/windows-11-dark-mode-blue-stock-official-3840x2400-5630.jpg";
import Navbar from '../../components/Navbar/Navbar';
import { FaMicrosoft } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Landing = () => {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  }, [])
  return (
    <div className='container-fluid p-0'>
      <img src={LandingImage} alt='error' className='image' />
      <div className='overlay'>
        <Navbar token={token} />
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-12 col-lg-6 text-white'>
              <div className='content-left'>
                <h1 className='mb-5'>Manage Your Work With Us</h1>
                <p className='mb-4'>
                  New look and feel. Easy way to search and stay organized.
                  Microsoft Organizer has been built to work for you and with you.
                </p>
                <p className='mb-3'>Microsoft Organizer allows you to manage your:</p>
                <ul>
                  <li className='mb-2'>Clients</li>
                  <li className='mb-2'>Providers</li>
                  <li className='mb-2'>Licenses</li>
                </ul>
                <Link to={token ? '/dashboard/data/provider' : '/login'}>
                  <button className='btnland py-3 text-white fs-5 mt-2 fw-semibold' >
                    Start Now
                  </button>
                </Link>
              </div>
            </div>
            <div className='d-none col-lg-6 text-white d-lg-block'>
                <div className='col-12 d-flex justify-content-center align-items-center'>
                    <FaMicrosoft size={150} className='me-2' />
                    <p className='fs-1 fw-semibold'>Microsoft Organizer</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
