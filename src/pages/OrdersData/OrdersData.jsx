import React, { useEffect, useState } from 'react';
import './OrdersData.scss';
import { FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';
import DataTable from '../../components/Table/Table';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { deleteOrder, getOrders } from '../../api/order';
import { FaShopLock } from 'react-icons/fa6';
import { FaShop } from 'react-icons/fa6';
import { CircularProgressbar } from 'react-circular-progressbar';
import toast from 'react-hot-toast';
const OrderData = () => {
  const [orders, setOrders] = useState([]);
  const userId = useSelector(state => state.userReducer.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getOrders();
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const addedOrders = orders.reduce((acc, order) => {
    return order.user.id === userId ? acc + 1 : acc;
  }, 0);

  const allOrders = orders.length;
  const percentage = (addedOrders && allOrders) ? Math.round((addedOrders / allOrders) * 100) : 0;

  const deleteOrderHandler = async(id) => {
    try {
      const {data} = await deleteOrder(id)
      setOrders(prev => {
        return prev.filter(order => order.id !== id)
      })
      toast.success(data.message)
      console.log(data);
    } catch (error) {
      console.log(error)
    }
  }


  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "client",
      headerName: "Client",
      width: 100,
      renderCell: (params) => (
        <p>{params.row.clientFirstName} {params.row.clientLastName}</p>
      ),
    },
    {
      field: "provider",
      headerName: "Provider",
      width: 140,
    },
    {
      field: "licence",
      headerName: "licence",
      width: 200,
    },
    {
      field: "purchase_date",
      headerName: "Purchase Date",
      width: 190,
    },
    // {
    //   field: "quantity",
    //   headerName: "Quantity",
    //   width: 220,
    // },
    // {
    //   field: "price",
    //   headerName: "Price",
    //   width: 220,
    //   renderCell: (params) => (
    //     <p>{params.row.quantity * params.row.licencePrice} $</p>
    //   ),

    // },
    {
      field: "addedby",
      headerName: "Added By",
      width: 220,
      renderCell: (params) => <div>{params.row.user_first_name} {params.row.user_last_name}</div>,
    },
  ];

  const userRows = orders.map(order => ({
    id: order.id,
    clientFirstName: order.client.first_name,
    clientLastName: order.client.last_name,
    provider: order.provider.name,
    licence: order.licence.name,
    purchase_date: order.purchase_date,
    quantity: order.quantity,
    licencePrice: order.licence.price,
    user_first_name: order.user.first_name,
    user_last_name: order.user.last_name,
  }));

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/dashboard/order/${params.row.id}/update`} >
            <div className='text-success' style={{ cursor: 'pointer' }}>
              <FaEdit size={25} />
            </div>
          </Link>
          <div className='text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteOrderHandler(params.row.id)} >
            <MdDelete size={25} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className='main container-fluid w-100 py-5 px-2 px-lg-5 position-relative'>
        <div className='row py-3 px-3'>
          <div className='col-12 col-md-6 col-lg-4 ps-lg-0 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-between align-items-center py-4' style={{ height: '300px' }}>
              <div className='d-flex justify-content-center align-items-center p-3 icon' style={{ backgroundColor: '#FFBE92' }}>
                <FaShop size={30} />
              </div>
              <p className='fs-3 fw-semibold mt-4'>Total Orders</p>
              <p className='fw-bold' style={{ fontSize: '50px' }}>{allOrders}</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-lg-4 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-center align-items-center py-4' style={{ height: "300px" }}>
              <div style={{ width: '200px', height: '200px' }}>
                <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={10} styles={{ path: { stroke: '#59D2F7' }, text: { fill: '#59D2F7' } }} />
              </div>
              <p className='mt-3 fs-5 fw-semibold'>Orders Percentage</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-lg-4 pe-lg-0 mb-2 mb-lg-0'>
            <div className='col-12 data-core d-flex flex-column justify-content-between align-items-center py-4' style={{ height: '300px' }}>
              <div className='d-flex justify-content-center align-items-center p-3 icon' style={{ backgroundColor: '#CEA9FB' }}>
                <FaShopLock size={30} />
              </div>
              <p className='fs-3 fw-semibold mt-4'>Added Orders</p>
              <p className='fw-bold' style={{ fontSize: '50px' }}>{addedOrders}</p>
            </div>
          </div>
        </div>
      <div className='container data-core w-100 py-3 px-4'>
        <div className='d-flex justify-content-between align-items-center mb-5' style={{ height: '40px' }}>
          {/* <div className='search d-flex justify-content-between align-items-center px-2 w-75'>
            <input type='text' placeholder='search by provider name...' className='input' onChange={changeInputHandler} />
            <FaSearch size={22} />
          </div> */}
            <Link to="/dashboard/data/order/add" end style={{ height: '100%' }}>
              <button className='button px-3 text-white'>Add&nbsp;<FaPlus /></button>
            </Link>
        </div>
        <DataTable userColumns={userColumns} userRows={userRows} actionColumn={actionColumn} order={true} />
      </div>
    </div>
  );
};

export default OrderData;
