import React, {useEffect, useState} from "react";

const CountButton = (props) => {
  const [count, setCount] = useState(props.count ? props.count : 0);

  useEffect(() => {
      props.setCount(count);
  },[count])

  const add = () => {
    setCount(count + 1);
  };
  const subtract = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ color: "white" }}>{count}</span>
      {count > 0 && (
        <span
          style={{ backgroundColor: "white", borderRadius: "100%", width: "1rem", height: "1rem" }}
          value="-"
          onClick={() => subtract()}
        >
          -
        </span>
      )}
      <span
        style={{ backgroundColor: "white", borderRadius: "100%", width: "1rem", height: "1rem" }}
        onClick={() => add()}
      >
        +
      </span>
    </div>
  );
};

export default CountButton;
