import React, { useRef, useEffect } from 'react';
import './Sidebar.scss';
import { useSelector } from 'react-redux';
import { FaPaperPlane, FaShopLock, FaUser } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaGlobeAmericas } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.userReducer);
  const navigate = useNavigate()
  const sidebarRef = useRef(null);
  const backendUrl = "http://localhost:3001/uploads/";
  const handleClickOutside = (event) => {
    const toggleButton = document.querySelector('.toggle-sidebar-btn');
    if (toggleButton && toggleButton.contains(event.target)) {
      return;
    }
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const logoutHandler = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div ref={sidebarRef} className={`sidebar overflow-y-auto ${isOpen ? 'open' : ''}`}>
      <div className='container p-4'>
        <div className='d-flex flex-column align-items-center mt-3'>
            <div className='avatar me-4 mb-3'>
                <img src={`${backendUrl}${user.image}`} alt='User' className='w-100 h-100' />
            </div>
            <div>
                <p className='fs-3 mb-0 fw-bold text-white'>{user?.firstName} {user?.lastName}</p>
                <p className='text-center' style={{color: "#ccc"}}>{user?.email}</p>
            </div>
        </div>
        <div className='container'>
            <div className='fw-bold mt-4 mb-3 ms-3 text-white' style={{fontSize: '14px'}} >DATA</div>
                <div>
                    <NavLink 
                        to="/dashboard/data/provider" 
                        className={({ isActive }) => 
                            isActive ? 'active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center link text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center link'
                        }
                    >
                        <FaShopLock /><span className='ms-3'>Universities</span>
                    </NavLink>

                    <NavLink 
                        to="/dashboard/data/licence" 
                        className={({ isActive }) => 
                            isActive ? 'active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center link text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center link'
                        }
                    >
                        <FaBookOpen /><span className='ms-3'>Licenses</span>
                    </NavLink>

                    <NavLink 
                        to="/dashboard/data/client" 
                        className={({ isActive }) => 
                            isActive ? 'active-link titles link fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 link d-flex align-items-center'
                        }
                    >
                        <FaUserTie /><span className='ms-3'>Students</span>
                    </NavLink>

                    <NavLink 
                        to="/dashboard/data/order" 
                        className={({ isActive }) => 
                            isActive ? 'link active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex link align-items-center'
                        }
                    >
                        <FaShoppingCart /><span className='ms-3'>Orders</span>
                    </NavLink>
                </div>
            </div>
        {(user.role === "admin" || user.role === "superadmin") && <div className='container mt-5'>
            <div className='fw-bold mt-4 mb-3 ms-3 text-white' style={{fontSize: '14px'}} >USERS</div>
            <NavLink 
                to="/dashboard/data/user" 
                className={({ isActive }) => 
                    isActive ? 'link active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex link align-items-center'
                }
            >
                <FaUser /><span className='ms-3'>Users</span>
            </NavLink>
        </div>}
        {(user.role === "admin" || user.role === "superadmin") && <div className='container mt-5'>
            <div className='fw-bold mt-4 mb-3 ms-3 text-white' style={{fontSize: '14px'}} >ANALYTICS</div>
            <div>
            <NavLink 
                to="/dashboard/analytics/sales" 
                className={({ isActive }) => 
                    isActive ? 'link active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex link align-items-center'
                }
            >
                <FaUser /><span className='ms-3'><FaMoneyCheckDollar/> Membership</span>
            </NavLink>
            {/* <NavLink 
                to="/dashboard/analytics/location" 
                className={({ isActive }) => 
                    isActive ? 'link active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex link align-items-center'
                }
            >
                <FaUser /><span className='ms-3'><FaGlobeAmericas/> Location</span>
            </NavLink> */}
            </div>
        </div>}
        <div className='container mt-5'>
            <div className='fw-bold mt-4 mb-3 ms-3 text-white' style={{fontSize: '14px'}} >OTHERS</div>
            <div>
            <NavLink 
                to="/dashboard/report/add" 
                className={({ isActive }) => 
                    isActive ? 'link active-link titles fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-decoration-none' : 'nav-link titles fs-5 fw-semibold px-3 py-1 d-flex link align-items-center'
                }
            >
                <FaUser /><span className='ms-3'><FaPaperPlane/> Report</span>
            </NavLink>
            </div>
        </div>
        <div className='container mt-5'>
            <div className='fw-bold mt-4 mb-3 ms-3 text-white' style={{fontSize: '14px'}} >ACCOUNT</div>
            <div onClick={logoutHandler} >
                <div className='link fs-5 fw-semibold px-3 py-1 d-flex align-items-center text-white' style={{cursor: 'pointer'}} ><TbLogout /><span className='ms-3'>Logout</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
