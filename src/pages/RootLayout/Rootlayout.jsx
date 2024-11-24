import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../store/UserSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Rootlayout.scss";
import { Toaster } from "react-hot-toast";
import { IoReorderThreeSharp } from "react-icons/io5";

const Rootlayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = jwtDecode(token);
      const expirationTimeMs = decodeToken.exp * 1000;
      if (expirationTimeMs > new Date().getTime()) {
        dispatch(
          UserActions.modifyUser({
            id: decodeToken.id,
            firstName: decodeToken.first_name,
            lastName: decodeToken.last_name,
            email: decodeToken.email,
            image: decodeToken.image,
            role: decodeToken.role,
            token: token,
          })
        );
      } else {
        localStorage.removeItem("token");
        dispatch(UserActions.logoutUser());
        navigate("/");
      }
    }
  }, [navigate, dispatch]);

  const user = useSelector((state) => state.userReducer);
  console.log(user);

  return (
    <div className="root-layout">
      <button
        className="toggle-sidebar-btn ms-3 p-2 text-black-50"
        onClick={() => setIsSidebarOpen(prev => !prev)}
        style={{backgroundColor: 'transparent', border: '1px solid #777', borderRadius: '15px'}}
      >
        <IoReorderThreeSharp size={40} />
      </button>
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          isOpen={isSidebarOpen || window.innerWidth >= 768} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
      <div className="main-content">
        <Toaster/>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Rootlayout;
