import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ title, onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="container">
        <div className="modalInner">
          <button className="icon close" onClick={onClose}></button>
          <h2>{title}</h2>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
export default Modal;
