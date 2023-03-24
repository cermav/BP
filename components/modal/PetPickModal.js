import PropTypes from "prop-types";
import React from "react";
import PetList, { LIGHT_THEME } from "../myPets/PetList";
import TransparentModal from "./TransparentModal";

const PetPickModal = (props) => {
  const petList = props.petList ? props.petList : null;
  const title = props.title || "Výběr zvířátka";

  return (
    <TransparentModal passClass={["modalBlack petPickModal"]} title={title} hide={props.hide}>
      <PetList petList={petList} theme={LIGHT_THEME} />
    </TransparentModal>
  );
};

PetPickModal.propTypes = {
  title: PropTypes.string,
  hide: PropTypes.func.isRequired,
};

export default PetPickModal;
