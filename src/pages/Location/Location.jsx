import React, { useEffect, useState, useRef } from "react";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { colorScale } from "./Countries";
import { getOrders } from "../../api/order";
import { countryCodeMapping } from "../../all_countries";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Location() {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.userReducer.role)
  useEffect(() => {
    if (userRole && userRole !== "admin" && userRole !== "superadmin") {
      navigate("/unauthorized")
    }
  }, [userRole, navigate])
  const [orders, setOrders] = useState([]);
  const [countrySales, setCountrySales] = useState({});
  const countrySalesRef = useRef(countrySales);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      try {
        const salesData = orders.reduce((acc, order) => {
          const country = order.client.address.country;
          const countryCode = countryCodeMapping[country];

          if (countryCode) {
            acc[countryCode] = (acc[countryCode] || 0) + order.quantity;
          } else {
            console.log(`No country code mapping for country: ${country}`);
          }
          return acc;
        }, {});

        console.log("Sales Data to be set:", salesData);
        setCountrySales(salesData);
        countrySalesRef.current = salesData; // Update ref
      } catch (error) {
        console.log(error);
      }
    }
  }, [orders]);

  const handleRegionTipShow = (event, label, code) => {
    console.log("Region Tip - code:", code);
    console.log("Region Tip - countrySales:", countrySalesRef.current); // Use ref
    const quantity = countrySalesRef.current[code] || 0;
    console.log(`Quantity for ${code}: ${quantity}`);
    label.html(`
      <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white; padding-left: 10px;">
        <p><b>${label.html()}</b></p>
        <p>Quantity: ${quantity}</p>
      </div>
    `);
  };

  return (
    <div style={{ margin: "auto", width: "100%", height: "820px" }}>
      <VectorMap
        map={worldMill}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        series={{
          regions: [
            {
              values: countrySales,
              scale: colorScale,
              min: 0,
              max: 10,
            },
          ],
        }}
        onRegionTipShow={handleRegionTipShow}
      />
    </div>
  );
}

export default Location;
