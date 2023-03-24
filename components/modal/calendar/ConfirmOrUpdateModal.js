import React from "react";
import TransparentModal from "../TransparentModal";
import { withNotie } from "react-notie";

const ConfirmOrUpdateModal = (props) => {
  return (
    <TransparentModal
      hasBackdrop={true}
      passClass={["modalBlack appointmentModal"]}
      title="Vytvořit termín"
      hide={props.hide}
    >
      <div className="container">
        <form></form>
      </div>
    </TransparentModal>
  );
};
export default withNotie(ConfirmOrUpdateModal);
