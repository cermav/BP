import { getAuthorizationHeader } from "../../../services/AuthToken";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatTimestamp } from "../../../helpers/formatTimestamp";

import ImageButton from "../../ImageButton";
import { calcterm } from "../../../helpers/formatTextDate";
import ToggleModalContent from "../../modal/ToggleModalContent";
import CreateEventOwnerModal from "../../modal/calendar/CreateEventOwnerModal";

const PetTerm = (props) => {
  const [appointments, setAppointments] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(null);
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(Date.now());
  const petObject = props.pet ? props.pet : null;
  const vets = props.vets ? props.vets : null;
  const fetchNewTerms = props.fetchNewTerms ? props.fetchNewTerms : null;
  useEffect(() => {
    if (petObject) {
      const fetchStates = async () => {
        const response = await fetch(process.env.apiURL + "pets/" + petObject?.id + "/appointments-list", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await response.json();
        let newObject;
        if (responseObject.length > 0)
          newObject = responseObject.sort((a, b) => (new Date(a.date) - new Date(b.date) > 0 ? 1 : -1));
        setAppointments(newObject);
        setAppointmentsCount(responseObject.length);
      };
      fetchStates();
    }
  }, [appointmentsUpdated, petObject, fetchNewTerms]);
  const now = Date.now();
  const setName = (date, now) => {
    const date1 = new Date(date);
    const date2 = new Date(now);
    const oneDay = 24 * 60 * 60 * 1000;
    const day1 = date1 / oneDay;
    const day2 = date2 / oneDay;
    if (day1 - day2 > 30) return "term";
    else return "termIsClose";
  };
  return (
    <>
      <div className="petTerms">
        <div className="petTermsInner">
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <h3>
              <ImageButton
                passClass="sectionHeader"
                text="Moje termíny"
                sign="/icons/calendar-alt-light.svg"
                imgPosition="left"
                fontWeight="700"
              />
            </h3>
          </div>
          <table className="petTermList">
            <thead>
              {appointments &&
                appointments?.slice(0, 3).map((item) => (
                  <tr key={Math.random()} className={setName(item.date, now)}>
                    <td key={Math.random()} className="name">
                      {item.title}
                    </td>
                    <td key={Math.random()} className="date">
                      {formatTimestamp(item.date)}
                    </td>
                    <td key={Math.random()} className="interval">
                      {calcterm(item.date, now)}
                    </td>
                  </tr>
                ))}
            </thead>
          </table>
          <div key={Math.random()} className="actions">
            <div key={Math.random()} className="flexContainer">
              {petObject && appointmentsCount >= 1 && (
                <Link
                  href={"/moje-zver/zvire/" + petObject?.id + "/terminy"}
                  as={"/moje-zver/zvire/" + petObject?.id + "/terminy"}
                >
                  <a id="allTerms">
                    <ImageButton
                      id="allTerms"
                      key="modalToogle"
                      text="Zobrazit"
                      cursor="pointer"
                      color="black"
                      fontWeight="bold"
                    />
                  </a>
                </Link>
              )}{" "}
              <div className="placeHolder"></div>
              <ToggleModalContent
                toggle={(show) => (
                  <a onClick={show} id="addTerm">
                    <ImageButton
                      key="modalToogle"
                      sign="/plus-CE6668.svg"
                      text="Přidat"
                      imgPosition="left"
                      id="addTerm"
                      cursor="pointer"
                      color="black"
                      fontWeight="bold"
                    />
                  </a>
                )}
                content={(hide) => (
                  <CreateEventOwnerModal
                    key="addModal"
                    pet={petObject}
                    vetsArray={vets}
                    hide={hide}
                    close={setAppointmentsUpdated}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetTerm;
