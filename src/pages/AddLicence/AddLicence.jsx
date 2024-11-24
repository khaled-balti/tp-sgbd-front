import React, { useState, useEffect } from 'react';
import './AddLicence.scss';
import Microsoft from '../../components/Microsoft/Microsoft';
import { addLicence, getLicence, updateLicence } from '../../api/licence';
import { Link,useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const AddLicence = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (userRole && userRole !== "admin" && userRole !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [userRole, navigate])
  const { licenceId } = useParams();
  const [fileName, setFileName] = useState("Enter the licence logo...");
  const [licenceInput, setLicenceInput] = useState({
    name: "",
    sku: "",
    price: 0,
    logo: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getLicence(licenceId);
        setLicenceInput({
          logo: null,
          name: data.name,
          sku: data.sku,
          price: data.price,
        });
        setFileName(data.logo);
      } catch (error) {
        console.log(error);
      }
    };
    if (licenceId) {
      fetchDetails();
    }
  }, [licenceId]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setLicenceInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleOnChangeFile = (e) => {
    e.preventDefault();
    setLicenceInput((prev) => ({
      ...prev,
      logo: e.target.files[0],
    }));
    setFileName(e.target.files[0].name);
    setErrors((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!licenceInput.name) newErrors.name = "Name is required";
    if (!licenceInput.sku) newErrors.sku = "Sku is required";
    if (!licenceInput.price) newErrors.price = "Price is required";
    if (!fileName || fileName === "Enter the licence logo...") newErrors.logo = "Logo is required";
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    for (const key in licenceInput) {
      formData.append(key, licenceInput[key]);
    }
    try {
      const { data } = await addLicence(formData);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add licence")
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
    const formData = new FormData();
    for (const key in licenceInput) {
      if (key === "logo" && licenceInput[key] === null) {
        continue;
      }
      formData.append(key, licenceInput[key]);
    }
    try {
      const { data } = await updateLicence(licenceId, formData);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add licence")
      console.log(error);
    }
  };

  return (
    <div className='main container-fluid w-100 py-5 px-2 px-lg-5 position-relative'>
      <div className='data-core w-100 py-3 px-4 d-flex flex-column align-items-center'>
        <Microsoft width={"100"} height={"100"} />
        <h3 className='mt-3 mb-4'>{licenceId ? 'Update Licence' : 'Create Licence'}</h3>
        <div className='container w-100'>
          <div className='w-100 d-flex flex-column mb-3'>
            <label htmlFor='name' className='mb-2 fs-5 fw-semibold'>Name: </label>
            <input
              type='text'
              placeholder='Enter the licence name...'
              value={licenceInput.name}
              name='name'
              id='name'
              className='inputs px-2 py-3'
              required
              onChange={handleOnChange}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className='w-100 d-flex flex-column mb-3'>
            <label htmlFor='sku' className='mb-2 fs-5 fw-semibold'>Sku: </label>
            <input
              type='text'
              placeholder='Enter the licence sku...'
              value={licenceInput.sku}
              name='sku'
              id='sku'
              className='inputs px-2 py-3'
              required
              onChange={handleOnChange}
            />
            {errors.sku && <span className="text-danger">{errors.sku}</span>}
          </div>
          <div className='w-100 d-flex flex-column mb-3'>
            <label htmlFor='price' className='mb-2 fs-5 fw-semibold'>Price: </label>
            <input
              type='number'
              placeholder='Enter the licence price...'
              value={licenceInput.price}
              min={20}
              max={1000}
              step={1}
              name='price'
              id='price'
              className='inputs px-2 py-3'
              required
              onChange={handleOnChange}
            />
            {errors.price && <span className="text-danger">{errors.price}</span>}
          </div>
          <div className='w-100 d-flex flex-column mb-3'>
            <p className='mb-2 fs-5 fw-semibold'>Logo: </p>
            <label htmlFor='logo' className='inputs px-2 py-3 text-black-50 fw-semibold'>{fileName}</label>
            <input
              type='file'
              name='logo'
              id='logo'
              hidden
              required
              onChange={handleOnChangeFile}
            />
            {errors.logo && <span className="text-danger">{errors.logo}</span>}
          </div>
        </div>
        <div className='container w-100 d-flex justify-content-between align-items-center mt-3 mb-3 px-4'>
          <Link to="/dashboard/data/licence" end>
            <button className='button-cancel px-3 py-2 fw-semibold'>Cancel</button>
          </Link>
          {!licenceId && (
            <button className='button-finish px-3 py-2 text-white fw-semibold' onClick={submitHandler}>
              Finish
            </button>
          )}
          {licenceId && (
            <button className='button-finish px-3 py-2 text-white fw-semibold' onClick={submitUpdateHandler}>
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLicence