import React, { useEffect, useState } from 'react';
import './UserData.scss';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import DataTable from '../../components/Table/Table';
import { getProviders} from '../../api/provider';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { deleteUser, getUsers } from '../../api/user';
import { getClients } from '../../api/client';
import { getOrders } from '../../api/order';
import { getLicences } from '../../api/licence';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const UserData = () => { 
  const navigate = useNavigate()
  const role = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (role && role !== "admin" && role !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [role, navigate])
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const backendUrl = "http://localhost:3001/uploads/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUsers();
        console.log(data);
        setUsers(data);
        setOriginalUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const deleteUserHandler = async(id) => {
    try {
      const responseClient = await getClients()
      const client = responseClient.data.find(client => client.user.id === id)
      const responseOrder = await getOrders()
      const order = responseOrder.data.find(order => order.user.id === id)
      const responseProvider = await getProviders()
      const provider = responseProvider.data.find(provider => provider.user.id === id)
      const responseLicence = await getLicences()
      const licence = responseLicence.data.find(licence => licence.user.id === id)
      if (client || order || provider || licence) {
        toast.error("you can't detete this user, it is associated with clients, licences, providers, orders")
      }
      else {
        const {data} = await deleteUser(id)
        setUsers(prev => {
        return prev.filter(user => user.id !== id)
        })
        setOriginalUsers(prev => {
        return prev.filter(user => user.id !== id)
        })
        toast.success(data.message)
        console.log(data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeInputHandler = (e) => {
    e.preventDefault();
    const inputValue = e.target.value.toUpperCase();

    setUsers(() => {
      if (inputValue === "") {
        return originalUsers; // Use the original list when input is empty
      }
      return originalUsers.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`
        return fullName.toUpperCase().startsWith(inputValue)
      }
      );
    });
  };

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "image",
      headerName: "image",
      width: 100,
      renderCell: (params) => (
        <div className="cellWithImg d-flex justify-content-center align-items-center mt-4">
          <img className="img-fluid" src={`${backendUrl}${params.row.image}`} alt="avatar" />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 140,
      renderCell: (params) => (
        <div>{params.row.first_name} {params.row.last_name}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      width: 220,
    },
  ];

  const userRows = users.map(user => ({
    id: user.id,
    image: user.image,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  }));

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <div className="d-flex justify-content-between align-items-center">
          {(role === "superadmin" || (role === "admin" && params.row.role === "account_manager")) && <Link to={`/dashboard/user/${params.row.id}/update`} >
            <div className='text-success' style={{ cursor: 'pointer' }}>
              <FaEdit size={25} />
            </div>
          </Link>}
          {(params.row.role !== "superadmin" && (role === "superadmin" || (role === "admin" && params.row.role === "account_manager"))) && <div className='text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteUserHandler(params.row.id)} >
            <MdDelete size={25} />
          </div>}
        </div>
      ),
    },
  ];

  return (
    <div className='main container-fluid w-100 py-5 px-2 px-lg-5 position-relative'>
      <div className='container data-core w-100 py-3 px-4'>
        <div className='d-flex justify-content-between align-items-center mb-5' style={{ height: '40px' }}>
          <div className='search d-flex justify-content-between align-items-center px-2 w-75'>
            <input type='text' placeholder='search by user name...' className='input' onChange={changeInputHandler} />
            <FaSearch size={22} />
          </div>
          <Link to="/dashboard/data/user/add" end style={{ height: '100%' }}>
              <button className='button px-3 text-white'>Add&nbsp;<FaPlus /></button>
          </Link>
        </div>
        <DataTable userColumns={userColumns} userRows={userRows} actionColumn={actionColumn} />
      </div>
    </div>
  );
};

export default UserData;
