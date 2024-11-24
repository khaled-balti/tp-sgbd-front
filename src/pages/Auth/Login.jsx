import React, { useState } from 'react'
import './Auth.scss'
import LoginBack from '../../assets/3616005.jpg'
import LoginImg from '../../assets/—Pngtree—log in login interface computer_3945571.png'
import Microsoft from '../../components/Microsoft/Microsoft'
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { loginApi } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [show, setShow] = useState(false)
    const [credentials, setCredentials] = useState({
      email: "",
      password: ""
    })
    const navigate = useNavigate()
    const onChangeHandler = (e) => {
      e.preventDefault()
      setCredentials(prev => {
        return {
          ...prev,
          [e.target.name]: e.target.value
        }
      })
      console.log(credentials)
    }

    const submitHandler = async(e) => {
      e.preventDefault()
      try {
        const data = await loginApi(credentials)
        if (data) {
          localStorage.setItem('token', data?.data)
          navigate('/dashboard/data/provider')
        }
      } catch (error) {
        window.alert(error.message)
      }
    }

  return (
    <div className='container-fluid p-0 d-flex justify-content-center align-items-center'>
      <img src={LoginBack} alt='error' className='image' />
      <div className='container-form'>
        <div className='row'>
            <div className='img-login d-none col-6 d-lg-flex justify-content-center align-items-center position-relative'>
                <img src={LoginImg} alt='error' />
            </div>
            <div className='col-12 col-lg-6 d-flex flex-column justify-content-center position-relative px-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    <Microsoft/>
                </div>
                <h1 className='mt-4 mb-4 text-center'>Hello Again!</h1>
                <p className='pb-1 mb-0 text-center'>Happy to see you again</p>
                <p className='mt-0 mb-4 text-center'> Write your credentials and start working</p>
                <div className='d-flex flex-column mb-4'>
                    <label htmlFor='email' className='fs-5 fw-semibold mb-2'>Email:</label>
                    <input type='email' name='email' id='email' placeholder='email...' className='p-2 input' onChange={onChangeHandler} />
                </div>
                <div className='d-flex flex-column mb-5'>
                    <label htmlFor='password' className='fs-5 fw-semibold mb-2'>Password:</label>
                    <div className='d-flex align-items-center input p-2'>
                        <input type={show ? 'test' : 'password'} name='password' id='password' placeholder='password...' className='w-100 border-0' style={{outline: 'none'}} onChange={onChangeHandler} />
                        {show && <FaEye onClick={() => setShow(false)} />}
                        {!show && <IoEyeOffSharp onClick={() => setShow(true)} />}
                    </div>
                </div>
                <button className='btn border-0 py-2 fw-semibold text-white' style={{backgroundColor: 'rgb(50,157,255)'}} onClick={submitHandler} >Login</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login