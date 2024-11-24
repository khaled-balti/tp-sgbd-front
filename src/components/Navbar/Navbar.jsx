import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import Microsoft from '../Microsoft/Microsoft';

const Navbar = ({token}) => {
  return (
    <nav className='navbar navbar-dark px-5' style={{ width: '100%', zIndex: 1 }}>
      <a className='navbar-brand'>
        <p className='fw-semibold text-white fs-4 fs-md-2'>
          <Microsoft />&nbsp;Microsoft
        </p>
      </a>
      {!token && <div className="d-flex align-items-center justify-content-center">
        <ul className='ms-auto d-flex justify-content-center align-items-center py-2'>
          <li className='d-flex align-items-center fs-5 fw-semibold'>
            <NavLink to='/login' end className="text-decoration-none">
              <button className='btn px-4 py-3 text-white fw-semibold fs-5'>
                Login
              </button>
            </NavLink>
          </li>
        </ul>
      </div>}
    </nav>
  );
};

export default Navbar;
