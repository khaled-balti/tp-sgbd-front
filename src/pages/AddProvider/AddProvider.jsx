import React, { useEffect, useState } from "react";
import "./AddProvider.scss";
import Microsoft from "../../components/Microsoft/Microsoft";
import { addProvider, getProvider, updateProvider } from "../../api/provider";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const AddProvider = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (userRole && userRole !== "admin" && userRole !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [userRole, navigate])
  const { providerId } = useParams();
  const [fileName, setFileName] = useState("Enter the provider logo...");
  const [providerInput, setProviderInput] = useState({
    name: "",
    email: "",
    phone: "",
    logo: null,
    // country: "",
    state: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getProvider(providerId);
        setProviderInput({
          country: data.address.country,
          state: data.address.state,
          city: data.address.city,
          logo: data.logo,
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
        console.log(data)
        setFileName(data.logo);
      } catch (error) {
        console.log(error);
      }
    };
    if (providerId) {
      fetchDetails();
    }
  }, [providerId]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setProviderInput((prev) => ({
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
    setProviderInput((prev) => ({
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
    if (!providerInput.name) newErrors.name = "Name is required";
    if (!providerInput.email) newErrors.email = "Email is required";
    if (!providerInput.phone) newErrors.phone = "Phone number is required";
    // if (!providerInput.country) newErrors.country = "Country is required";
    if (!providerInput.state) newErrors.state = "State is required";
    if (!providerInput.city) newErrors.city = "City is required";
    if (!providerInput.logo) newErrors.logo = "Logo is required";
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
    for (const key in providerInput) {
      formData.append(key, providerInput[key]);
    }
    try {
      const { data } = await addProvider(formData);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add provider")
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
    for (const key in providerInput) {
      if (key === "logo" && typeof providerInput[key] === "string") {
        continue;
      }
      formData.append(key, providerInput[key]);
    }
    try {
      const { data } = await updateProvider(providerId, formData);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to update provider")
      console.log(error);
    }
  };

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
        <Microsoft width={"100"} height={"100"} />
        <h3 className="mt-3 mb-4">{providerId ? 'Update University' : 'Create University'}</h3>
        <div className="container w-100">
          <div className="row w-100">
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center px-4">
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="name" className="mb-2 fs-5 fw-semibold">Name: </label>
                <input
                  type="text"
                  placeholder="Enter the provider name..."
                  value={providerInput.name}
                  name="name"
                  id="name"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.name && <span className="text-danger">{errors.name}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="email" className="mb-2 fs-5 fw-semibold">Email: </label>
                <input
                  type="email"
                  placeholder="Enter the provider email..."
                  value={providerInput.email}
                  name="email"
                  id="email"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="phone" className="mb-2 fs-5 fw-semibold">Phone: </label>
                <input
                  type="text"
                  placeholder="Enter the provider phone number..."
                  value={providerInput.phone}
                  name="phone"
                  id="phone"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.phone && <span className="text-danger">{errors.phone}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <p className="mb-2 fs-5 fw-semibold">Logo: </p>
                <label
                  htmlFor="logo"
                  className="inputs px-2 py-3 text-black-50 fw-semibold"
                >
                  {fileName}
                </label>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  hidden
                  onChange={handleOnChangeFile}
                />
                {errors.logo && <span className="text-danger">{errors.logo}</span>}
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center px-4">
              {/* <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="country" className="mb-2 fs-5 fw-semibold">Country: </label>
                <input
                  type="text"
                  placeholder="Enter the provider country..."
                  value={providerInput.country}
                  name="country"
                  id="country"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.country && <span className="text-danger">{errors.country}</span>}
              </div> */}
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="state" className="mb-2 fs-5 fw-semibold">State: </label>
                <input
                  type="text"
                  placeholder="Enter the provider state..."
                  value={providerInput.state}
                  name="state"
                  id="state"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.state && <span className="text-danger">{errors.state}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="city" className="mb-2 fs-5 fw-semibold">City: </label>
                <input
                  type="text"
                  placeholder="Enter the provider city..."
                  value={providerInput.city}
                  name="city"
                  id="city"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                />
                {errors.city && <span className="text-danger">{errors.city}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="container w-100 d-flex justify-content-between align-items-center mt-3 mb-3 px-4">
          <Link to="/dashboard/data/provider" end>
            <button className="button-cancel px-3 py-2 fw-semibold">Cancel</button>
          </Link>
          {!providerId && (
            <button
              className="button-finish px-3 py-2 text-white fw-semibold"
              onClick={submitHandler}
            >
              Finish
            </button>
          )}
          {providerId && (
            <button
              className="button-finish px-3 py-2 text-white fw-semibold"
              onClick={submitUpdateHandler}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProvider;
