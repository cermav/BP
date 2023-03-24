import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SafariDate = (props) => {
  const [startDate, setStartDate] = useState(props && props.date ? new Date(props.date) : null);
  useEffect(() => {
    props.setDate(startDate);
  }, [startDate]);
  return (
    <div className={props.error && "safari-input-error"}>
      <DatePicker
        placeholderText="zadejte datum"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd.MM.yyyy"
      />
    </div>
  );
};
export default SafariDate;
