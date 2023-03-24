import { useState, useEffect } from "react";
import Bowser from "bowser";
import SafariDate from "../../../../helpers/SafariDate";
const step4 = (props) => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  const [birthDate, setBirthDate] = useState(props.birthDate);
  useEffect(() => {
    props.setBirthDate(birthDate);
  }, [birthDate]);
  return (
    <>
      <h1>Datum narození</h1>
      <p>
        {browser.getBrowserName() === "Safari" ? (
          <SafariDate setDate={setBirthDate} date={birthDate} />
        ) : (
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            onChange={(e) => setBirthDate(e.target.value)}
            defaultValue={props.birthDate}
          ></input>
        )}
      </p>
    </>
  );
};
export default step4;
