import React from "react";
import TransparentModal from "./TransparentModal";

const PetCompletedModal = () => {
    const title = "Šlo nám to spolu skvěle a máme hotovo!";
    console.log("completedModal");
    const pet = {
        avatar: "/images/favicon-original.png",
    };
    return (
        <TransparentModal passClass={["petCompletedModal"]} title={title} hide={props.hide}>
            <PetIcon pet={pet} />
        </TransparentModal>
    );
};

export default PetCompletedModal;
