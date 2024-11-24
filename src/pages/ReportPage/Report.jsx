import React, { useState, useEffect } from "react";
import "./Report.scss";
import Microsoft from "../../components/Microsoft/Microsoft";
import { addReport, getReports } from "../../api/reports";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Report = () => {
  const role = useSelector((state) => state.userReducer.role);
  const [reportInput, setReportInput] = useState({
    object: "",
    content: "",
  });
  const [reports, setReports] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getReports();
        setReports(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (role === "superadmin") {
      fetchDetails();
    }
  }, [role]); // Added role to the dependency array

  const onChangeHandler = (e) => {
    e.preventDefault();
    setReportInput((prev) => ({
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
    if (!reportInput.object) newErrors.object = "Object is required";
    if (!reportInput.content) newErrors.content = "Content is required";
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
      const { data } = await addReport(reportInput);
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      toast.error("failed to add report")
      console.log(error);
    }
  };

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      {(role === "account_manager" || role === "admin") && (
        <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
          <Microsoft width={"100"} height={"100"} />
          <h3 className="mt-3 mb-5">Create Report</h3>
          <div className="container w-100">
            <div className="w-100 d-flex flex-column mb-3">
              <label htmlFor="object" className="mb-2 fs-5 fw-semibold">
                Object:
              </label>
              <input
                type="text"
                placeholder="Enter the report object..."
                name="object"
                id="object"
                className="inputs px-2 py-3"
                required
                onChange={onChangeHandler}
                value={reportInput.object}
              />
              {errors.object && <span className="text-danger">{errors.object}</span>}
            </div>
            <div className="w-100 d-flex flex-column mb-3">
              <label htmlFor="content" className="mb-2 fs-5 fw-semibold">
                Content:
              </label>
              <textarea
                placeholder="Enter the report content..."
                name="content"
                id="content"
                className="inputs px-2 py-3"
                required
                style={{
                  height: "300px",
                  maxHeight: "300px",
                  minHeight: "300px",
                }}
                onChange={onChangeHandler}
                value={reportInput.content}
              ></textarea>
              {errors.content && <span className="text-danger">{errors.content}</span>}
            </div>
          </div>
          <div className="container w-100 d-flex justify-content-end align-items-center mt-3 mb-3 px-4">
            <button
              className="button-finish px-3 py-2 text-white fw-semibold"
              onClick={submitHandler}
            >
              Finish
            </button>
          </div>
        </div>
      )}
      {role === "superadmin" && (
        <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
          {reports &&
            reports.map((report) => (
              <Link to={`/dashboard/report/${report.id}`} className="report mb-4 w-100 py-4 px-4 text-decoration-none text-black"
              >
                <div
                  key={report.id}
                  className="d-flex align-items-center justify-content-between"
                >
                  <p>
                    <span className="fw-semibold fs-5">
                      {report.user.first_name} {report.user.last_name}
                    </span>{" "}
                    have sent a report
                  </p>
                  <p className="text-black-50">{report.date}</p>
                </div>
              </Link>
            ))}
            {reports.length === 0 && <div className="text-center fs-4 py-3" >No Reports Available...</div>}
        </div>
      )}
    </div>
  );
};

export default Report;
