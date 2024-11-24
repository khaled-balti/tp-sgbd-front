import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CircularProgressbar } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';
import { FaShop } from "react-icons/fa6";
import { FaShopLock } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { getOrders } from '../../api/order';
import DataTable from '../../components/Table/Table';
import { deleteProvider, getProviders } from '../../api/provider';
import './ProviderData.scss';
const ProviderData = () => {
  const [providers, setProviders] = useState([]);
  const [originalProviders, setOriginalProviders] = useState([]);
  const userId = useSelector(state => state.userReducer.id);
  const role = useSelector(state => state.userReducer.role);
  const backendUrl = "http://localhost:3001/uploads/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProviders();
        console.log(data);
        setProviders(data);
        setOriginalProviders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const addedProviders = originalProviders.reduce((acc, provider) => {
    return provider.user.id === userId ? acc + 1 : acc;
  }, 0);

  const allProviders = originalProviders.length;
  const percentage = (addedProviders && allProviders) ? Math.round((addedProviders / allProviders) * 100) : 0;

  const deleteProviderHandler = async(id) => {
    try {
      const response = await getOrders()
      const order = response.data.find(order => order.provider.id === id)
      if (order) {
        toast.error("you can't detete this provider, it is associated with orders")
      }
      else {
        const {data} = await deleteProvider(id)
        setProviders(prev => {
          return prev.filter(provider => provider.id !== id)
        })
        setOriginalProviders(prev => {
          return prev.filter(provider => provider.id !== id)
        })
        console.log(data);
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeInputHandler = (e) => {
    e.preventDefault();
    const inputValue = e.target.value.toUpperCase();

    setProviders(() => {
      if (inputValue === "") {
        return originalProviders;
      }
      return originalProviders.filter(provider =>
        provider.name.toUpperCase().startsWith(inputValue)
      );
    });
  };

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      renderCell: (params) => (
        <div className="cellWithImg d-flex justify-content-center align-items-center mt-4">
          <img className="img-fluid" src={`${backendUrl}${params.row.logo}`} alt="avatar" />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 140,
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
      renderCell: (params) => <div>{params.row.country}, {params.row.state}, {params.row.city}</div>,
    },
    {
      field: "addedby",
      headerName: "Added By",
      width: 220,
      renderCell: (params) => <div>{params.row.user_first_name} {params.row.user_last_name}</div>,
    },
  ];

  const userRows = providers.map(provider => ({
    id: provider.id,
    logo: provider.logo,
    name: provider.name,
    email: provider.email,
    phone: provider.phone,
    country: provider.address.country,
    state: provider.address.state,
    city: provider.address.city,
    user_first_name: provider.user.first_name,
    user_last_name: provider.user.last_name,
  }));

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/dashboard/provider/${params.row.id}/update`} >
            <div className='text-success' style={{ cursor: 'pointer' }}>
              <FaEdit size={25} />
            </div>
          </Link>
          <div className='text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteProviderHandler(params.row.id)} >
            <MdDelete size={25} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className='main container-fluid w-100 py-5 px-2 px-lg-5 position-relative'>
      {(role === "admin" || role === "superadmin") && (
        <div className='row py-3 px-3'>
          <div className='col-12 col-md-6 col-lg-4 ps-lg-0 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-between align-items-center py-4' style={{ height: '300px' }}>
              <div className='d-flex justify-content-center align-items-center p-3 icon' style={{ backgroundColor: '#FFBE92' }}>
                <FaShop size={30} />
              </div>
              <p className='fs-3 fw-semibold mt-4'>Total Universities</p>
              <p className='fw-bold' style={{ fontSize: '50px' }}>{allProviders}</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-lg-4 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-center align-items-center py-4' style={{ height: "300px" }}>
              <div style={{ width: '200px', height: '200px' }}>
                <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={10} styles={{ path: { stroke: '#59D2F7' }, text: { fill: '#59D2F7' } }} />
              </div>
              <p className='mt-3 fs-5 fw-semibold'>Universities Percentage</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-lg-4 pe-lg-0 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-between align-items-center py-4' style={{ height: '300px' }}>
              <div className='d-flex justify-content-center align-items-center p-3 icon' style={{ backgroundColor: '#CEA9FB' }}>
                <FaShopLock size={30} />
              </div>
              <p className='fs-3 fw-semibold mt-4'>Added Universities</p>
              <p className='fw-bold' style={{ fontSize: '50px' }}>{addedProviders}</p>
            </div>
          </div>
        </div>
      )}
      <div className='container data-core w-100 py-3 px-4'>
        <div className='d-flex justify-content-between align-items-center mb-5' style={{ height: '40px' }}>
          <div className='search d-flex justify-content-between align-items-center px-2 w-75'>
            <input type='text' placeholder='search by provider name...' className='input' onChange={changeInputHandler} />
            <FaSearch size={22} />
          </div>
          {(role === "admin" || role === "superadmin") && (
            <Link to="/dashboard/data/provider/add" end style={{ height: '100%' }}>
              <button className='button px-3 text-white'>Add&nbsp;<FaPlus /></button>
            </Link>
          )}
        </div>
        <DataTable userColumns={userColumns} userRows={userRows} actionColumn={actionColumn} />
      </div>
    </div>
  );
};

export default ProviderData;
