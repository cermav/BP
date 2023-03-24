import PetBackground from "./PetBackground";
import Layout from "../../../layouts/Loggedin";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import PetIcon from "./PetIcon";
import AppointmentModal from "../../modal/AppointmentModal";
import ForwardModal from "../../modal/ForwardModal";
import DeleteModal from "../../modal/DeleteModal";
import ToggleModalContent from "../../modal/ToggleModalContent";
import PetPickModal from "../../modal/PetPickModal";
import { calculateDistance } from "../../../helpers/calculateDistance";
import ImageButton from "../../ImageButton";
import {coordsFromLS, addDistances, getUsersLocation} from "../../../helpers/geoLocation";

const Appointments = () => {
  const text1 = "Upravit";
  const sign1 = "/pen-solid.svg";
  const sign2 = "/plus-CE6668.svg";

  const router = useRouter();
  const now = Date.now();

  const [appointments, setAppointments] = useState([]);
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(Date.now());
  const [vetsArray, setVetsArray] = useState([]);
  const [userCoordinates, setuserCoordinates] = useState(false);
  const [vetsWithDistance, setVetsWithDistance] = useState(null);
  const [pet, setPet] = useState(null);
  const [allVets, setAllVets] = useState([]);

  useEffect(() => {
    if (pet) {
      const fetchVets = async () => {
        const response = await fetch(process.env.apiURL + "vets/" + pet?.owners_id + "/favorite_vets", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await response.json();
        setVetsArray(responseObject);
      };
      fetchVets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  useEffect(() => {
    coordsFromLS() && setuserCoordinates(coordsFromLS());
    allVets && setVetsWithDistance(addDistances(allVets, userCoordinates));
  }, [vetsArray]);
  useEffect(() => {
    const fetchStates = async () => {
      const result = await fetch(process.env.apiURL + "pets/" + router.query.slug + "/appointments-list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await result.json();
      if (result.status == 401) return router.replace("../../../login");
      setAppointments(responseObject);
    };
    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentsUpdated]);
  useEffect(() => {
    const fetchStates = async () => {
      const result = await fetch(process.env.apiURL + "pets/" + router.query.slug, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const petObject = await result.json();
      setPet(petObject);
    };
    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValid = (date, now) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const date1 = new Date(date);
    const date2 = new Date(now);

    return Math.round((date1 - date2) / oneDay);
  };

  useEffect(() => {
    coordsFromLS && setVetsWithDistance(coordsFromLS());
    allVets && setVetsWithDistance(addDistances(allVets, userCoordinates));
  }, [vetsArray]);

  const setName = (date, now) => {
    const date1 = new Date(date);
    const date2 = new Date(now);
    const oneDay = 24 * 60 * 60 * 1000;
    const day1 = date1 / oneDay;
    const day2 = date2 / oneDay;
    if (day1 - day2 > 30) return "row";
    else return "rowClose";
  };

  return (
    <Layout bodyClass="appointments" registrationPromo={false}>
      <div className="appointmentContainer">
        <PetBackground key={Math.random()} pet={pet} />
        <section className="topSection">
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
              <h1>{pet?.pet_name}</h1>
              <a className="petUpdate" href={"/moje-zver/zvire/" + pet?.id + "/upravit"}>
                <ImageButton
                  color="white"
                  cursor="pointer"
                  fontSize="14px"
                  border={true}
                  text={text1}
                  sign={sign1}
                  fontWeight="bold"
                />
              </a>
            </div>
          </div>
        </section>
        <div className="placeHolder"></div>
        <div className="tableTop">
          <div className="appointmentButtons">
            <div className="holder">
              <div
                className="wrap"
                style={{ display: "flex" }}
                onClick={() => router.push("/moje-zver/zvire/" + pet?.id)}
              >
                <ImageButton
                  passClass="tableButtons"
                  text="Zpět"
                  imgPosition="left"
                  id="back"
                  cursor="pointer"
                  color="#838383"
                />
              </div>
            </div>
            <h1>Důležité termíny</h1>
            <ToggleModalContent
              toggle={(show) => (
                <div className="holder" style={{ display: "flex", justifyContent: "flex-end" }} id="createRecord">
                  <div className="wrap" style={{ display: "flex" }} onClick={show}>
                    <ImageButton
                      passClass="tableButtons"
                      key="modalToogle"
                      sign={sign2}
                      text="Nový termín"
                      imgPosition="left"
                      id="addTerm"
                      cursor="pointer"
                      color="#838383"
                      fontWeight="bold"
                    />
                  </div>
                </div>
              )}
              content={(hide) => (
                <AppointmentModal
                  type="add"
                  pet={pet}
                  vetsArray={vetsArray}
                  vetMetaArray={vetsWithDistance}
                  title="Přidat termín"
                  hide={hide}
                  close={setAppointmentsUpdated}
                />
              )}
            />
          </div>
        </div>
        <div className="appointmentsList">
          {appointments?.length > 0 && (
            <div className="firstRow">
              <div className="description">Název</div>
              <div className="date">Datum</div>
              <div className="interval">Zbývá</div>
              <div className="doctor">doktor</div>
              <div className="placeHolder">&nbsp;</div>
            </div>
          )}
          {appointments &&
            appointments
              .sort((a, b) => (new Date(a.date) - new Date(b.date) > 0 ? 1 : -1))
              .map((item, index) => (
                <div key={`a${index}`} className={setName(item.date, now)}>
                  <div className="first holder">
                    <div className="name" key={`name${index}`}>
                      {item.description}
                    </div>
                    <div className="doctor small" key={`doctor1${index}`}>
                      <div className="label">Ordinace: </div>
                      <a href={`/vets/${item.slug}`}>
                        <div className="text">
                          {allVets.filter((vet) => vet.id == item.doctor_id).map((vet) => vet.name)}
                        </div>
                      </a>
                    </div>
                    <div className="date small" key={`date1${index}`}>
                      <div className="label">Datum: </div>
                      <div className="text">{formatTimestamp(item.date)}</div>
                    </div>
                    <div className="interval small" key={`interval1${index}`}>
                      <div className="label">Zbývá: </div>
                      <div className="text">{handleValid(item.date, now)} dní</div>
                    </div>
                  </div>
                  <div className="second holder">
                    <div className="interval small" key={`interval2${index}`}>
                      <div className="label">Zbývá: </div>
                      <div className="text">{handleValid(item.date, now)} dní</div>
                    </div>
                    <div className="date small" key={`date2${index}`}>
                      <div className="label">Datum: </div>
                      <div className="text">{formatTimestamp(item.date)}</div>
                    </div>
                  </div>
                  <div className="date" key={`date4${index}`}>
                    {formatTimestamp(item.date)}
                  </div>
                  <div className="interval" key={`interval3${index}`}>
                    {handleValid(item.date, now)} dní
                  </div>

                  <div className="doctor" key={`doctor2${index}`}>
                    <div className="label">Ordinace: </div>
                    {allVets
                      .filter((vet) => vet.id == item.doctor_id)
                      .map((vet) => (
                        <a href={`/vets/${vet.slug}`}>
                          <div className="text">{vet.name}</div>
                        </a>
                      ))}
                  </div>
                  <div className="icons" key={`icons${index}`}>
                    <ToggleModalContent
                      toggle={(show) => (
                        <div className="sign" id={`delete${item.description}`}>
                          <img onClick={show} src="/icons/notes-medical-solid-white.svg" alt="delete"></img>
                        </div>
                      )}
                      content={(hide) => (
                        <ForwardModal
                          pet={pet}
                          vetsArray={vetsArray}
                          vetMetaArray={vetsWithDistance}
                          appointment={item}
                          petId={router.query.slug}
                          title="Vytvořit záznam pro:"
                          hide={hide}
                          close={setAppointmentsUpdated}
                        />
                      )}
                    />
                    <div className="icons-group">
                      <ToggleModalContent
                        toggle={(show) => (
                          <div className="sign" key={`sign${index}`} id={`edit${item.description}`}>
                            <img onClick={show} src="/pen-solid-white.svg" alt="edit" key={`edit1${index}`}></img>
                          </div>
                        )}
                        content={(hide) => (
                          <AppointmentModal
                            type="edit"
                            id={item.id}
                            pet={pet}
                            vetsArray={vetsArray}
                            vetMetaArray={vetsWithDistance}
                            appointment={item}
                            selectedDoctor={item?.doctor_id}
                            title="Upravit termín"
                            hide={hide}
                            close={setAppointmentsUpdated}
                          />
                        )}
                      />
                      <ToggleModalContent
                        toggle={(show) => (
                          <div className="sign" id={`delete${item.description}`}>
                            <img onClick={show} src="/trash-alt-light.svg" alt="delete"></img>
                          </div>
                        )}
                        content={(hide) => (
                          <DeleteModal
                            id={item.id}
                            petId={router.query.slug}
                            title="Odstranit termín"
                            hide={hide}
                            removal="appointment"
                            content="Skutečně chcete smazat tento termín?"
                            close={setAppointmentsUpdated}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </Layout>
  );
};
export default Appointments;
