import Link from "next/link";
import React, { useState, useEffect } from "react";
import PetPickModal from "../../modal/PetPickModal";
import ToggleModalContent from "../../modal/ToggleModalContent";
import BackgroundModal from "../../modal/BackgroundModal";
import ImageButton from "../../ImageButton";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { useSelector } from "react-redux";

const PetBackground = (props) => {
  const petList = props.petList ? props.petList : null;
  const imageRedux = useSelector((state) => state.pet);
  const [pet, setPet] = useState(props.pet ? props.pet : { background: " " });
  const [petCount, setPetCount] = useState(petList && petList.length);
  useEffect(() => {
    setPet(props.pet);
  }, [props.pet]);
  const text1 = "Změnit pozadí";
  const sign1 = "/pen-solid.svg";
  const text2 = "Přidat další zvířátko";
  const sign2 = "/plus-regular.svg";
  const imageSwitch = () => {
    if (imageRedux.background) {
      return process.env.storageUrl + "/pet_background/" + imageRedux.background + "?" + Math.random();
    } else if (pet?.background) {
      return process.env.storageUrl + "/pet_background/" + pet?.background;
    }
  };
  useEffect(() => {
    const fetchStates = async () => {
      const response = await fetch(process.env.apiURL + "pets/list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responeObject = await response.json();
      setPetCount(responeObject.length);
    };
    if (!petList) fetchStates();
  }, []);
  return (
    <div
      className="petBackground"
      style={{
        backgroundColor: "#81b9b9",
        borderBottomRightRadius: "2rem",
        borderBottomLeftRadius: "2rem",
      }}
    >
      <div className="actions">
        <div className="top">
          <div className="flexContainer">
            <ToggleModalContent
              toggle={(show) => (
                <ImageButton
                  show={show}
                  passClass="dark"
                  text={text1}
                  sign={sign1}
                  color="white"
                  imgPosition="right"
                  cursor="pointer"
                  fontWeight="bold"
                />
              )}
              content={(hide) => <BackgroundModal pet={pet} title="Změnit pozadí" hide={hide} />}
            />
          </div>
        </div>
        <div className="bottom">
          <div className="flexContainer">
            {petCount > 1 && (
              <ToggleModalContent
                toggle={(show) => (
                  <ImageButton
                    passClass="dark"
                    color="white"
                    text="Přepnout na jiné zvířátko"
                    cursor="pointer"
                    fontWeight="bold"
                    show={show}
                  />
                )}
                content={(hide) => <PetPickModal pet={pet} title="Přepnout na jiné zvířátko" hide={hide} />}
              />
            )}
            <Link href="/moje-zver/vytvorit">
              <a>
                <ImageButton
                  passClass="dark"
                  color="white"
                  text={text2}
                  sign={sign2}
                  cursor="pointer"
                  imgPosition="left"
                  fontWeight="bold"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
      {(imageRedux.background || pet?.background) && (
        <div
          style={{
            backgroundImage: `url(${imageSwitch()} `,
          }}
          className="background"
          //src={imageSwitch()}
          alt="Fotografie zvířátka"
          //style={{ borderColor: props.color }}
        />
      )}
    </div>
  );
};

export default PetBackground;
