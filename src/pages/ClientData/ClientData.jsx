import React, { useEffect, useState } from "react";
import "./ClientData.scss";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import DataTable from "../../components/Table/Table";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import { FaUser } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { deleteClient, getClients } from "../../api/client";
import { getOrders } from "../../api/order";
import toast from "react-hot-toast";
const ClientData = () => {
  const [clients, setClients] = useState([]);
  const [originalClients, setOriginalClients] = useState([]);
  const userId = useSelector((state) => state.userReducer.id);
  const role = useSelector((state) => state.userReducer.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getClients();
        console.log(data);
        setClients(data);
        setOriginalClients(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const addedClients = originalClients.reduce((acc, client) => {
    return client.user.id === userId ? acc + 1 : acc;
  }, 0);

  const allClients = originalClients.length;
  const percentage =
    addedClients && allClients
      ? Math.round((addedClients / allClients) * 100)
      : 0;

  const deleteClientHandler = async (id) => {
    try {
      const response = await getOrders();
      const order = response.data.find((order) => order.client.id === id);
      if (order) {
        toast.error(
          "you can't detete this client, it is associated with orders"
        );
      } else {
        const { data } = await deleteClient(id);
        setClients((prev) => {
          return prev.filter((client) => client.id !== id);
        });
        setOriginalClients((prev) => {
          return prev.filter((client) => client.id !== id);
        });
        toast.success(data.message);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeInputHandler = (e) => {
    e.preventDefault();
    const inputValue = e.target.value.toUpperCase();

    setClients(() => {
      if (inputValue === "") {
        return originalClients;
      }
      return originalClients.filter((client) => {
        const fullName = `${client.first_name} ${client.last_name}`;
        return fullName.toUpperCase().startsWith(inputValue);
      });
    });
  };

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    ,
    {
      field: "first_name",
      headerName: "First Name",
      width: 100,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 100,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 190,
    },
    {
      field: "address",
      headerName: "Address",
      width: 220,
      renderCell: (params) => (
        <div>
          {params.row.country}, {params.row.state}, {params.row.city}
        </div>
      ),
    },
    {
      field: "addedby",
      headerName: "Added By",
      width: 220,
      renderCell: (params) => (
        <div>
          {params.row.user_first_name} {params.row.user_last_name}
        </div>
      ),
    },
  ];

  const userRows = clients.map((client) => ({
    id: client.id,
    first_name: client.first_name,
    last_name: client.last_name,
    email: client.email,
    phone: client.phone,
    password: client.password,
    country: client.address.country,
    state: client.address.state,
    city: client.address.city,
    user_first_name: client.user.first_name,
    user_last_name: client.user.last_name,
  }));

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/dashboard/client/${params.row.id}/update`} end>
            <div className="text-success" style={{ cursor: "pointer" }}>
              <FaEdit size={25} />
            </div>
          </Link>
          <div
            className="text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => deleteClientHandler(params.row.id)}>
            <MdDelete size={25} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      {(role === "admin" || role === "superadmin") && (
        <div className="row py-3 px-3">
          <div className="col-12 col-md-6 col-lg-4 ps-lg-0 mb-2 mb-lg-0">
            <div
              className="col-12 data-core d-flex flex-column justify-content-between align-items-center py-4"
              style={{ height: "300px" }}>
              <div
                className="d-flex justify-content-center align-items-center p-3 icon"
                style={{ backgroundColor: "#FFBE92" }}>
                <FaUser size={30} />
              </div>
              <p className="fs-3 fw-semibold mt-4">Total Students</p>
              <p className="fw-bold" style={{ fontSize: "50px" }}>
                {allClients}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-2 mb-lg-0">
            <div
              className="col-12 data-core d-flex flex-column justify-content-center align-items-center py-4"
              style={{ height: "300px" }}>
              <div style={{ width: "200px", height: "200px" }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  strokeWidth={10}
                  styles={{
                    path: { stroke: "#59D2F7" },
                    text: { fill: "#59D2F7" },
                  }}
                />
              </div>
              <p className="mt-3 fs-5 fw-semibold">Students Percentage</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 pe-lg-0 mb-2 mb-lg-0">
            <div
              className="col-12 data-core d-flex flex-column justify-content-between align-items-center py-4"
              style={{ height: "300px" }}>
              <div
                className="d-flex justify-content-center align-items-center p-3 icon"
                style={{ backgroundColor: "#CEA9FB" }}>
                <FaUserCheck size={30} />
              </div>
              <p className="fs-3 fw-semibold mt-4">Added Students</p>
              <p className="fw-bold" style={{ fontSize: "50px" }}>
                {addedClients}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="container data-core w-100 py-3 px-4">
        <div
          className="d-flex justify-content-between align-items-center mb-5"
          style={{ height: "40px" }}>
          <div className="search d-flex justify-content-between align-items-center px-2 w-75">
            <input
              type="text"
              placeholder="search by client name..."
              className="input"
              onChange={changeInputHandler}
            />
            <FaSearch size={22} />
          </div>
          {(role === "admin" || role === "superadmin") && (
            <Link
              to="/dashboard/data/client/add"
              end
              style={{ height: "100%" }}>
              <button className="button px-3 text-white">
                Add&nbsp;
                <FaPlus />
              </button>
            </Link>
          )}
        </div>
        <DataTable
          userColumns={userColumns}
          userRows={userRows}
          actionColumn={actionColumn}
        />
      </div>
    </div>
  );
};

export default ClientData;
