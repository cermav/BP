import PropTypes from "prop-types";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const TransparentModal = (props) => {
  const hasBackdrop = props.hasBackdrop || true;
  let modalClasses = ["modalTransparent"];
  if (typeof document === "object") {
    document.documentElement.style.overflow = "hidden";
  }

  if ("passClass" in props && Array.isArray(props.passClass)) {
    modalClasses = modalClasses.concat(props.passClass);
  }

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        props.hide();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  });

  return ReactDOM.createPortal(
    <React.Fragment>
      {hasBackdrop ? <div className="modalBackdrop" onClick={props.hide} /> : null}
      <div className={modalClasses.join(" ")}>
        {"title" in props ? (
          <h2 className="modalTitle">
            {props.title}
            {props.title && <button className="icon close" onClick={props.hide}></button>}
          </h2>
        ) : null}
        <div className="modalInner">{props.children}</div>
      </div>
    </React.Fragment>,
    document.getElementById("modal-root")
  );
};

TransparentModal.propTypes = {
  title: PropTypes.string,
  hasBackdrop: PropTypes.bool,
  passClass: PropTypes.arrayOf(PropTypes.string),
  hide: PropTypes.func.isRequired,
};

export default TransparentModal;
