import React, { useState, useEffect } from "react";
import CountButton from "./CountButton";
import unfetch from "isomorphic-unfetch";
import {getAuthorizationHeader} from "../../../services/AuthToken";

const Billing = (props) => {

  const doctorId = parseInt(props.doctorId);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      const response = await unfetch(`${process.env.apiURL}doctor/price-list/get`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await response.json();
      setItems(responseObject);
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const handleBillingItems = () => {
      props.setBillingItems(items);
    }

    handleBillingItems();
  },[items]);

  const setCount = (count, item, index) => {
    const tmp = [...items];
    tmp[index].count = count;
    setItems(tmp);
  };

  return (
    <div style={{ width: "100%" }}>
      {items &&
        items.map((item, index) => {
          if (item.doctor_id === doctorId) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid white",
                  borderRadius: "2rem",
                  padding: "0.5rem 2rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ color: "white" }}>{item.description}</span>

                <CountButton count={item.count} setCount={(count) => setCount(count, item, index)} />
              </div>
            );
          }
        })}
    </div>
  );
};

export default Billing;
