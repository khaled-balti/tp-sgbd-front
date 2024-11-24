import React, { useEffect, useState } from "react";
import "./AddOrder.scss";
import Microsoft from "../../components/Microsoft/Microsoft";
import { Link, useParams } from "react-router-dom";
import { addOrder, getOrder, updateOrder } from "../../api/order";
import { getClients } from "../../api/client";
import { getLicences } from "../../api/licence";
import { getProviders } from "../../api/provider";
import toast from "react-hot-toast";
const AddOrder = () => {
  const { orderId } = useParams();
  const [orderInput, setOrderInput] = useState({
    client: "",
    provider: "",
    licence: "",
    // quantity: 0
  });
  const [clients, setClients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [licences, setLicences] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getOrder(orderId);
        setOrderInput({
          client: data.client.id,
          provider: data.provider.id,
          licence: data.licence.id,
          quantity: data.quantity,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const [fetchedClients, fetchedProviders, fetchedLicences] = await Promise.all([
          getClients(),
          getProviders(),
          getLicences()
        ]);
        setClients(fetchedClients.data);
        setProviders(fetchedProviders.data);
        setLicences(fetchedLicences.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (orderId) {
      fetchDetails();
    }
    fetchData();
  }, [orderId]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setOrderInput((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!orderInput.client) newErrors.client = "Client is required";
    if (!orderInput.provider) newErrors.provider = "Provider is required";
    if (!orderInput.licence) newErrors.licence = "Licence is required";
    if (orderInput.quantity <= 0) newErrors.quantity = "Quantity must be greater than zero";
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
      if (orderId) {
        const { data } = await updateOrder(orderId, orderInput);
        toast.success(data.message)
        console.log(data);
      } else {
        const { data } = await addOrder(orderInput);
        toast.success(data.message)
        console.log(data);
      }
    } catch (error) {
      if (orderId) {
        toast.error("failed to update order")
      }
      else {
        toast.error("failed to add order")
      }
      console.log(error);
    }
  };

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      <div className="data-core w-100 py-3 px-4 d-flex flex-column align-items-center">
        <Microsoft width={"100"} height={"100"} />
        <h3 className="mt-3 mb-4">{orderId ? 'Update Order' : 'Create Order'}</h3>
        <div className="container w-100">
          <div className="w-100 d-flex flex-column mb-3">
            <label htmlFor="client" className="mb-2 fs-5 fw-semibold">Student:</label>
            <select
              name="client"
              id="client"
              className="inputs px-2 py-3"
              onChange={handleOnChange}
              value={orderInput.client}
            >
              <option value="" hidden>Select a student</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </select>
            {errors.client && <span className="text-danger">{errors.client}</span>}
          </div>
          <div className="w-100 d-flex flex-column mb-3">
            <label htmlFor="provider" className="mb-2 fs-5 fw-semibold">University:</label>
            <select
              name="provider"
              id="provider"
              className="inputs px-2 py-3"
              onChange={handleOnChange}
              value={orderInput.provider}
            >
              <option value="" hidden>Select a university</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {errors.provider && <span className="text-danger">{errors.provider}</span>}
          </div>
          <div className="w-100 d-flex flex-column mb-3">
            <label htmlFor="licence" className="mb-2 fs-5 fw-semibold">Licence:</label>
            <select
              name="licence"
              id="licence"
              className="inputs px-2 py-3"
              onChange={handleOnChange}
              value={orderInput.licence}
            >
              <option value="" hidden>Select a licence</option>
              {licences.map(licence => (
                <option key={licence.id} value={licence.id}>
                  {licence.name}
                </option>
              ))}
            </select>
            {errors.licence && <span className="text-danger">{errors.licence}</span>}
          </div>
          {/* <div className="w-100 d-flex flex-column mb-3">
            <label htmlFor="quantity" className="mb-2 fs-5 fw-semibold">Quantity:</label>
            <input
              type="number"
              placeholder="Enter the quantity..."
              value={orderInput.quantity}
              name="quantity"
              id="quantity"
              className="inputs px-2 py-3"
              required
              onChange={handleOnChange}
            />
            {errors.quantity && <span className="text-danger">{errors.quantity}</span>}
          </div> */}
        </div>
        <div className="container w-100 d-flex justify-content-between align-items-center mt-3 mb-3 px-4">
          <Link to="/dashboard/data/order" end>
            <button className="button-cancel px-3 py-2 fw-semibold">Cancel</button>
          </Link>
          <button
            className="button-finish px-3 py-2 text-white fw-semibold"
            onClick={submitHandler}
          >
            {orderId ? 'Update' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
