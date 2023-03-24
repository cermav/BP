import React, { useState } from "react";

const ToggleModalContent = ({ toggle, content }) => {
  const [isShown, setIsShown] = useState(false);
  const hide = () => {
    if (typeof document === "object") {
      document.documentElement.style.overflow = "scroll";
    }
    setIsShown(false);
  };
  const show = () => {
    setIsShown(true);
  };

  return (
    <>
      {toggle(show)}
      {isShown && content(hide)}
    </>
  );
};

export default ToggleModalContent;
