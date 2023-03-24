import TransparentModal from "./TransparentModal";
import React, { useState } from "react";
import { getUserId, getAuthorizationHeader } from "../../services/AuthToken";
import VetSearch from "../form/VetSearch";

const VetModal = (props) => {
  const hide = props.hide ? props.hide : null;
  const title = props.title ? props.title : null;
  const [err, setErr] = useState(" ");
  const [vetId, setVetId] = useState(null);

  const send = () => {
    const ownerId = getUserId();
    if (!vetId || !ownerId) {
      setErr("Vyberte prosím svého oblíbeného veterináře.");
      return;
    } else {
      const submit = async () => {
        const response = await fetch(process.env.apiURL + "vets/" + ownerId + "/favorite_vets/" + vetId, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        switch (response.status) {
          case (200, 201):
            props.close(Date.now());
            hide();
            break;
          case 401:
            setErr("Zřejmě nejste přihlášen k žádnému účtu.");
            break;
          case 404:
            setErr("Tento veterinář nebyl nalezen v databázi.");
            break;
          case 409:
            setErr("Tento veterinář již je váš oblíbený.");
            break;
          default:
            setErr("Něco je špatně, zkuste to prosím znovu");
        }
      };
      submit();
    }
  };

  return (
    <TransparentModal hasBackdrop={true} passClass={["modalBlack"]} title={title} hide={props.hide}>
      <div className="container vetModal">
        <VetSearch setVetId={setVetId} />
        <div className="error">{err}</div>
        <div className="buttons">
          <input type="button" className="back" onClick={() => hide()} value="Zrušit"></input>
          <input type="button" className="add" value="přidat" id="submit" onClick={() => send()}></input>
        </div>
      </div>
    </TransparentModal>
  );
};
export default VetModal;
