import React, { useEffect, useState } from "react";
import "./AddUser.scss";
import Microsoft from "../../components/Microsoft/Microsoft";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addUser, getUser, updateUser } from "../../api/user";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
const AddUser = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (userRole && userRole !== "admin" && userRole !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [userRole, navigate])
  const [showPassword, setShowPassword] = useState(false);
  const { userId } = useParams();
  const [fileName, setFileName] = useState("Enter the provider logo...");
  const [userInput, setUserInput] = useState({
    first_name: "",
    last_name: "",
    image: null,
    role: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getUser(userId);
        setUserInput({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          image: data.image,
          role: data.role,
        });
        setFileName(data.image);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchDetails();
    }
  }, [userId]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setUserInput((prev) => ({
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
    setUserInput((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
    setFileName(e.target.files[0].name);
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!userInput.first_name) newErrors.first_name = "First name is required";
    if (!userInput.last_name) newErrors.last_name = "Last name is required";
    if (!userInput.email) newErrors.email = "Email is required";
    if (!userInput.role) newErrors.role = "Role is required";
    if (!userInput.password && !userId) newErrors.password = "Password is required";
    if (!fileName || fileName === "Enter the provider logo...") newErrors.image = "Image is required";
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
    for (const key in userInput) {
      formData.append(key, userInput[key]);
    }
    try {
      const { data } = await addUser(formData);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add user")
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
    for (const key in userInput) {
      if ((key === "image" && typeof userInput[key] === "string") || (key === "password" && userInput[key] === "")) {
        continue;
      }
      formData.append(key, userInput[key]);
    }
    try {
      const { data } = await updateUser(userId, formData);
      toast.success(data.message)
      console.log('Update success:', data);
    } catch (error) {
      toast.error("failed to update user")
      console.log('Update failed:', error);
    }
  };

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
        <Microsoft width={"100"} height={"100"} />
        <h3 className="mt-3 mb-4">{userId ? "Update User" : "Create User"}</h3>
        <div className="container w-100">
          <div className="row w-100">
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center px-4">
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="first_name" className="mb-2 fs-5 fw-semibold">
                  First Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter the user first name..."
                  value={userInput.first_name}
                  name="first_name"
                  id="first_name"
                  className="inputs px-2 py-3"
                  required
                  onChange={handleOnChange}
                />
                {errors.first_name && <span className="text-danger">{errors.first_name}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="last_name" className="mb-2 fs-5 fw-semibold">
                  Last Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter the user last name..."
                  value={userInput.last_name}
                  name="last_name"
                  id="last_name"
                  className="inputs px-2 py-3"
                  required
                  onChange={handleOnChange}
                />
                {errors.last_name && <span className="text-danger">{errors.last_name}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="email" className="mb-2 fs-5 fw-semibold">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Enter the user email..."
                  value={userInput.email}
                  name="email"
                  id="email"
                  className="inputs px-2 py-3"
                  required
                  onChange={handleOnChange}
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}
              </div>
              <div className="w-100 d-flex flex-column mb-3">
                <p className="mb-2 fs-5 fw-semibold">Image:</p>
                <label
                  htmlFor="image"
                  className="inputs px-2 py-3 text-black-50 fw-semibold"
                >
                  {fileName}
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  hidden
                  required
                  onChange={handleOnChangeFile}
                />
                {errors.image && <span className="text-danger">{errors.image}</span>}
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center px-4">
              {userRole !== "superadmin" && <div className="w-100 d-flex flex-column mb-3">
                <label htmlFor="role" className="mb-2 fs-5 fw-semibold">
                  Role:
                </label>
                <select
                  name="role"
                  id="role"
                  className="inputs px-2 py-3"
                  onChange={handleOnChange}
                  value={userInput.role}
                >
                  <option value="" hidden>
                    Select a Role
                  </option>
                  <option value="account_manager">Account Manager</option>
                  {userRole === "superadmin" && <option value="admin">Admin</option>}
                </select>
                {errors.role && <span className="text-danger">{errors.role}</span>}
              </div>}
              {!userId && (
                <div className="w-100 d-flex flex-column mb-3">
                  <label htmlFor="password" className="mb-2 fs-5 fw-semibold">
                    Password:
                  </label>
                  <div
                    className="d-flex align-items-center"
                    style={{ backgroundColor: "rgb(234,234,234)", borderRadius: "15px" }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter the user password..."
                      value={userInput.password}
                      name="password"
                      id="password"
                      className="inputs px-2 py-3"
                      required
                      onChange={handleOnChange}
                      style={{ width: "95%" }}
                    />
                    <div onClick={() => setShowPassword(prev => !prev)} style={{ cursor: 'pointer' }}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                  {errors.password && <span className="text-danger">{errors.password}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container w-100 d-flex justify-content-between align-items-center mt-3 mb-3 px-4">
          <Link to="/dashboard/data/user" end>
            <button className="button-cancel px-3 py-2 fw-semibold">
              Cancel
            </button>
          </Link>
          <button
            className="button-finish px-3 py-2 text-white fw-semibold"
            onClick={userId ? submitUpdateHandler : submitHandler}
          >
            {userId ? "Update" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
