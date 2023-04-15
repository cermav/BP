import React from "react";
import InputDate from "../../../form/InputDate";
const step4 = (props) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return (
    <>
      <h1>Datum narození</h1>
      <p>
          <InputDate date={props.birthDate} setDate={date => props.setBirthDate(date)} name={"birth_date"} id={"birth_date"}/>
      </p>
    </>
  );
};
export default step4;
