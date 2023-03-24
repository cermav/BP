import React from "react";
import ToggleModalContent from "../../modal/ToggleModalContent";
import AvatarModal from "../../modal/AvatarModal";
import { useSelector } from "react-redux";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

const PetIcon = (props) => {
  const imageRedux = useSelector((state) => state.pet);
  const petIconClasses = ["petIcon"];
  const pet = props.pet ? props.pet : null;
  const imageSwitch = () => {
    if (imageRedux.avatar) {
      return process.env.storageUrl + "/pet_avatar/" + imageRedux.avatar + "?" + Math.random();
    } else if (pet?.avatar) {
      return process.env.storageUrl + "/pet_avatar/" + pet?.avatar;
    } else return "/images/favicon-original.png";
  };

  return (
    <div className={petIconClasses.join(" ")}>
      <img className="avatar" src={imageSwitch()} alt="obrázek zvířátka"></img>
      <ToggleModalContent
        toggle={(show) => (
          <div className="editSign" onClick={show}>
            <img src="/pen-solid.svg" fill="white" alt="upravit" />
          </div>
        )}
        content={(hide) => <AvatarModal pet={pet} title="Změnit obrázek mazlíčka" hide={hide} />}
      />
    </div>
  );
};

export default PetIcon;
