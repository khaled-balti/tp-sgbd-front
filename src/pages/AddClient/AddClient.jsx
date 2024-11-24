import React, { useState, useEffect } from 'react';
import './AddClient.scss';
import Microsoft from '../../components/Microsoft/Microsoft';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addClient, getClient, updateClient } from '../../api/client';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const AddClient = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (!userRole || !["admin", "superadmin"].includes(userRole)) {
      navigate("/unauthorized");
    }
  }, [userRole, navigate]);
  const { clientId } = useParams();
  const [clientInput, setClientInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // country: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getClient(clientId);
        setClientInput({
          // country: data.address.country,
          state: data.address.state,
          city: data.address.city,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (clientId) {
      fetchDetails();
    }
  }, [clientId]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setClientInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    Object.keys(clientInput).forEach((key) => {
      if (!clientInput[key]) {
        newErrors[key] = `${key.replace("_", " ")} is required`;
      }
    });
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const { data } = await addClient(clientInput);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add client")
      console.log(error);
    }
  };

  const submitUpdateHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const { data } = await updateClient(clientId, clientInput);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to update client")
      console.log(error);
    }
  };

  return (
    <div className='main container-fluid w-100 py-5 px-2 px-lg-5 position-relative'>
      <div className='data-core w-100 py-3 px-4 d-flex flex-column align-items-center'>
        <Microsoft width={"100"} height={"100"} />
        <h3 className='mt-3 mb-4'>{clientId ? 'Update Student' : 'Create Student'}</h3>
        <div className='container w-100'>
          <div className='row w-100'>
            <div className='col-12 col-lg-6 d-flex flex-column align-items-center px-4'>
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='first_name' className='mb-2 fs-5 fw-semibold'>First Name:</label>
                <input
                  type='text'
                  placeholder='Enter the client first name...'
                  value={clientInput.first_name}
                  name='first_name'
                  id='first_name'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.first_name && <span className="text-danger">{errors.first_name}</span>}
              </div>
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='last_name' className='mb-2 fs-5 fw-semibold'>Last Name:</label>
                <input
                  type='text'
                  placeholder='Enter the client last name...'
                  value={clientInput.last_name}
                  name='last_name'
                  id='last_name'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.last_name && <span className="text-danger">{errors.last_name}</span>}
              </div>
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='email' className='mb-2 fs-5 fw-semibold'>Email:</label>
                <input
                  type='email'
                  placeholder='Enter the client email...'
                  value={clientInput.email}
                  name='email'
                  id='email'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}
              </div>
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='phone' className='mb-2 fs-5 fw-semibold'>Phone:</label>
                <input
                  type='text'
                  placeholder='Enter the client phone number...'
                  value={clientInput.phone}
                  name='phone'
                  id='phone'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.phone && <span className="text-danger">{errors.phone}</span>}
              </div>
            </div>
            <div className='col-12 col-lg-6 d-flex flex-column align-items-center px-4'>
              {/* <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='country' className='mb-2 fs-5 fw-semibold'>Country:</label>
                <input
                  type='text'
                  placeholder='Enter the client country...'
                  value={clientInput.country}
                  name='country'
                  id='country'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.country && <span className="text-danger">{errors.country}</span>}
              </div> */}
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='state' className='mb-2 fs-5 fw-semibold'>State:</label>
                <input
                  type='text'
                  placeholder='Enter the client state...'
                  value={clientInput.state}
                  name='state'
                  id='state'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.state && <span className="text-danger">{errors.state}</span>}
              </div>
              <div className='w-100 d-flex flex-column mb-3'>
                <label htmlFor='city' className='mb-2 fs-5 fw-semibold'>City:</label>
                <input
                  type='text'
                  placeholder='Enter the client city...'
                  value={clientInput.city}
                  name='city'
                  id='city'
                  className='inputs px-2 py-3'
                  required
                  onChange={handleOnChange}
                />
                {errors.city && <span className="text-danger">{errors.city}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className='container w-100 d-flex justify-content-between align-items-center mt-3 mb-3 px-4'>
          <Link to="/dashboard/data/client" end><button className='button-cancel px-3 py-2 fw-semibold'>Cancel</button></Link>
          {!clientId && <button className='button-finish px-3 py-2 text-white fw-semibold' onClick={submitHandler}>Finish</button>}
          {clientId && <button className='button-finish px-3 py-2 text-white fw-semibold' onClick={submitUpdateHandler}>Update</button>}
        </div>
      </div>
    </div>
  );
};

export default AddClient;
