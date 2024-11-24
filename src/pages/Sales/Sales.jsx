import React, { useEffect, useState } from "react";
import "./Sales.scss";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Sales = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (userRole && userRole !== "admin" && userRole !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [userRole, navigate])
  const [orders, setOrders] = useState([]);
  // const [licences, setLicences] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartLicenceData, setChartLicenceData] = useState([]);
  const [chartMoneyData, setChartMoneyData] = useState([]);
  const [lastSixMonthsData, setLastSixMonthsData] = useState([]);
  const [lastSixMonthsLicenceData, setLastSixMonthsLicenceData] = useState([]);
  const [lastSixMonthsMoneyData, setLastSixMonthsMoneyData] = useState([]);
  const [licensePieData, setLicensePieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await getOrders();
        setOrders(ordersResponse.data);
        // const licencesResponse = await getLicences();
        // setLicences(licencesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    // Aggregate order data
    const monthCounts = orders.reduce((acc, order) => {
      const orderDate = new Date(order.purchase_date);
      const orderMonth = orderDate.toLocaleString("default", { month: "long" });
      const orderYear = orderDate.getFullYear();

      if (orderYear === currentYear) {
        acc[orderMonth] = (acc[orderMonth] || 0) + 1;
      }
      return acc;
    }, {});

    const quantityCounts = orders.reduce((acc, order) => {
      const orderDate = new Date(order.purchase_date);
      const orderMonth = orderDate.toLocaleString("default", { month: "long" });
      const orderYear = orderDate.getFullYear();

      if (orderYear === currentYear) {
        acc[orderMonth] = (acc[orderMonth] || 0) + order.quantity;
      }
      return acc;
    }, {});

    const moneyCounts = orders.reduce((acc, order) => {
      const orderDate = new Date(order.purchase_date);
      const orderMonth = orderDate.toLocaleString("default", { month: "long" });
      const orderYear = orderDate.getFullYear();

      if (orderYear === currentYear) {
        acc[orderMonth] =
          (acc[orderMonth] || 0) + order.quantity * order.licence.price;
      }
      return acc;
    }, {});

    const licenseCounts = orders.reduce((acc, order) => {
      const licenseName = order.licence.name;
      acc[licenseName] = (acc[licenseName] || 0) + order.quantity;
      return acc;
    }, {});

    const licensePieDataArray = Object.keys(licenseCounts).map((license) => ({
      name: license,
      value: licenseCounts[license],
    }));

    setLicensePieData(licensePieDataArray);

    // Prepare chart data
    const chartDataArray = Object.keys(monthCounts).map((month) => ({
      month,
      counter: monthCounts[month],
    }));
    const chartLicenceDataArray = Object.keys(quantityCounts).map((month) => ({
      month,
      counter: quantityCounts[month],
    }));
    const chartMoneyDataArray = Object.keys(moneyCounts).map((month) => ({
      month,
      counter: moneyCounts[month],
    }));

    setChartData(chartDataArray);
    setChartLicenceData(chartLicenceDataArray);
    setChartMoneyData(chartMoneyDataArray);
  }, [orders]);

  useEffect(() => {
    const getMonthName = (date) => {
      return date.toLocaleString("default", { month: "long" });
    };

    const currentYear = new Date().getFullYear();

    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return getMonthName(date);
    }).reverse();

    const lastSixMonthsDataArray = lastSixMonths.map((month) => {
      const monthData = chartData.find((data) => data.month === month);
      return {
        month,
        counter: monthData ? monthData.counter : 0,
      };
    });
    const lastSixMonthsDataLicenceArray = lastSixMonths.map((month) => {
      const monthData = chartLicenceData.find((data) => data.month === month);
      return {
        month,
        counter: monthData ? monthData.counter : 0,
      };
    });
    const lastSixMonthsDataMoneyArray = lastSixMonths.map((month) => {
      const monthData = chartMoneyData.find((data) => data.month === month);
      return {
        month,
        counter: monthData ? monthData.counter : 0,
      };
    });

    setLastSixMonthsData(lastSixMonthsDataArray);
    setLastSixMonthsLicenceData(lastSixMonthsDataLicenceArray);
    setLastSixMonthsMoneyData(lastSixMonthsDataMoneyArray);
    console.log(lastSixMonthsDataArray);
    console.log(lastSixMonthsDataLicenceArray);
    console.log(lastSixMonthsDataMoneyArray);
  }, [chartData]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="main container-fluid w-100 py-5 px-2 px-lg-5 position-relative">
      <div className="data-core w-100 py-5 px-4 d-flex flex-column align-items-center mb-5">
        <h2 className="mb-5">Orders Number Last 6 Months Progress</h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lastSixMonthsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis dataKey="counter" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="counter"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="data-core w-100 py-5 px-4 d-flex flex-column align-items-center mb-5">
        <h2 className="mb-5">
          Ordered Licences Quantity Number Last 6 Months Progress
        </h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lastSixMonthsLicenceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis dataKey="counter" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="counter"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* <div className="data-core w-100 py-5 px-4 mb-5 d-flex flex-column align-items-center">
        <h2 className="mb-5">Income Amount Last 6 Months Progress</h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lastSixMonthsMoneyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis dataKey="counter" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="counter"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}
      <div className="data-core w-100 py-5 px-4 d-flex flex-column align-items-center">
        <h2 className="mb-5">License Distribution For Longtime</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={licensePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {licensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Sales;
