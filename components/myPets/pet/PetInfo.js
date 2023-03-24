import React from "react";
import PetIcon from "./PetIcon";
import { useState, useEffect } from "react";
import Link from "next/link";
import ImageButton from "../../ImageButton";
import PetPickModal from "../../modal/PetPickModal";
import ToggleModalContent from "../../modal/ToggleModalContent";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
const Pet = (props) => {
  const [pet, setPet] = useState(props.pet ? props.pet : null);
  useEffect(() => {
    setPet(props.pet);
  }, [props.pet]);
  const text1 = "Upravit";
  const sign1 = "/pen-solid.svg";
  const text2 = "Základní údaje";
  const sign2 = "/info-circle-solid.svg";
  return (
    <>
      {pet && (
        <div className="petInfo">
          <div className="petIcons">
            <ToggleModalContent
              toggle={(show) => <img className="sideIcon" src="/icons/repeat-light.svg" onClick={() => show()}></img>}
              content={(hide) => <PetPickModal pet={pet} title="Vaše zvířátka" hide={hide} />}
            />
            <PetIcon pet={pet} color="#fd8985" />
            <Link href="/moje-zver/vytvorit">
              <a>
                <img className="sideIcon" src="/icons/plus-circle-light.svg"></img>
              </a>
            </Link>
          </div>
          <div className="petInfoInner">
            <h1 id={pet?.pet_name}>{pet?.pet_name}</h1>
            <h3>
              <ImageButton
                color="white"
                text={text2}
                sign={sign2}
                imgPosition={"left"}
                fontWeight="700"
                imgWidth="28px"
              />
            </h3>
            <ul className="petInfoList">
              <li>
                <span>Datum narození</span>
                <span id={formatTimestamp(pet?.birth_date)}>{formatTimestamp(pet?.birth_date)}</span>
              </li>
              <li>
                <span>Druh</span>
                <span id={pet?.kind}>{pet?.kind}</span>
              </li>
              <li>
                <span>Plemeno</span>
                <span id={pet?.breed}>{pet?.breed}</span>
              </li>
              <li>
                <span>Pohlaví</span>
                <span id={pet?.gender_state_id == 1 ? "Samec" : "Samice"}>
                  {pet?.gender_state_id == 1 ? "Samec" : "Samice"}
                </span>
              </li>
              {pet?.kind == "Pes" && pet?.chip_number && (
                <li>
                  <span>Číslo čipu</span>
                  <span id={pet?.chip_number}>{pet?.chip_number}</span>
                </li>
              )}
            </ul>
            <Link href={"/moje-zver/zvire/" + pet?.id + "/upravit"}>
              <a id="petUpdate">
                <ImageButton color="white" cursor="pointer" text={text1} sign={sign1} fontWeight="bold" />
              </a>
            </Link>
            <img className="petInfoImage" src={"/images/pets-pes_motiv.png"} alt="Obrázek psa" />
          </div>
        </div>
      )}
    </>
  );
};

export default Pet;
