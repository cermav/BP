import Link from "next/link";
import Layout from "../../../layouts/Loggedin";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import PetIcon from "./PetIcon";
import VaccineModal from "../../modal/VaccineModal";
import DeleteModal from "../../modal/DeleteModal";
import ToggleModalContent from "../../modal/ToggleModalContent";
import ImageButton from "../../ImageButton";
import PetPickModal from "../../modal/PetPickModal";
import BackgroundModal from "../../modal/BackgroundModal";
import { calculateDistance } from "../../../helpers/calculateDistance";
import { useSelector } from "react-redux";

const Vaccines = () => {
  const router = useRouter();
  const text1 = "Upravit";
  const sign1 = "/pen-solid.svg";
  const sign2 = "/plus-CE6668.svg";
  const sign3 = "/plus-regular.svg";
  const imageRedux = useSelector((state) => state.pet);
  const [vaccines, setVaccines] = useState(null);
  const [vetsArray, setVetsArray] = useState([]);
  const [userCoordinates, setuserCoordinates] = useState(false);
  const [vetsWithDistance, setVetsWithDistance] = useState(null);
  const [vaccinesUpdated, setVaccinesUpdated] = useState(Date.now());
  const [pet, setPet] = useState(null);
  const oneDay = 24 * 60 * 60 * 1000;
  const [allVets, setAllVets] = useState([]);
  let coordsFromLS = {
    lat:
      typeof window === "object" &&
      window.localStorage.getItem("lat") !== null &&
      typeof window === "object" &&
      window.localStorage.getItem("lat") !== ""
        ? parseFloat(typeof window === "object" && window.localStorage.getItem("lat"))
        : "",
    long:
      typeof window === "object" &&
      window.localStorage.getItem("long") !== null &&
      typeof window === "object" &&
      window.localStorage.getItem("long") !== ""
        ? parseFloat(typeof window === "object" && window.localStorage.getItem("long"))
        : "",
  };
  const addDistances = (allPins) => {
    let newPins = allPins.map((element) => ({ ...element }));
    if (userCoordinates !== false) {
      newPins.forEach((element) => {
        element.distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          element.latitude,
          element.longitude
        );
      });
    }
    setVetsWithDistance(newPins);
  };
  const getUsersLocation = (coordsFromLS) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const distanceFromLastTime = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        coordsFromLS.lat,
        coordsFromLS.long
      );
      if (distanceFromLastTime > 1) {
        localStorage.setItem("lat", position.coords.latitude);
        localStorage.setItem("long", position.coords.longitude);
      }
      setuserCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };
  useEffect(() => {
    const fetchVets = async () => {
      const result = await fetch(process.env.apiURL + "all-doctors", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const vets = await result.json();
      typeof window === "object" && window.localStorage.setItem("allVets", JSON.stringify(vets));
      setAllVets(vets);
    };
  }, []);
  useEffect(() => {
    const isClient = typeof window === "object";
    if (isClient) document.documentElement.style.overflow = "scroll";
    if (pet) {
      const fetchStates = async () => {
        const result = await fetch(process.env.apiURL + "vaccine/" + pet?.id + "/vaccines", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await result.json();
        if (result.status == 401) return router.replace("../../../login");
        const sortedVaccines = responseObject?.sort((a, b) => {
          var dateA = new Date(a.apply_date);
          var dateB = new Date(b.apply_date);
          dateA.setTime(dateA.getTime() + a.valid * oneDay);
          dateB.setTime(dateB.getTime() + b.valid * oneDay);
          var result;
          dateA > dateB ? (result = 1) : (result = -1);
          return result;
        });
        setVaccines(sortedVaccines);
      };
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
      fetchStates();
      fetchVets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, vaccinesUpdated]);
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

  useEffect(() => {
    coordsFromLS && getUsersLocation(coordsFromLS);
    allVets && addDistances(allVets);
  }, [vetsArray]);
  const setName = (valid) => {
    if (valid > 30) return "row";
    else return "rowClose";
  };
  const toggleClass = (id) => {
    const modal = document?.getElementById("modal");
    if (modal) return;
    const className = document?.getElementById(id)?.className;
    switch (className) {
      case "row":
        document.getElementById(id).className = "row open";
        break;
      case "rowClose":
        document.getElementById(id).className = "rowClose open";
        break;
      case "row open":
        document.getElementById(id).className = "row";
        break;
      case "rowClose open":
        document.getElementById(id).className = "rowClose";
        break;
      default:
        return;
    }
  };
  const handleValid = (applyDate, valid) => {
    const oneDay = 24 * 60 * 60 * 1000;
    var result = new Date(applyDate);
    valid >= 0 && result.setTime(result.getTime() + valid * oneDay);
    result = Math.ceil((result - new Date(Date.now())) / oneDay);
    result == 0 && result++;
    return result;
  };
  const imageSwitch = () => {
    var result = "/images/horse@2x.png";
    if (pet && pet?.background) result = process.env.storageUrl + "/pet_background/" + pet?.background;
    if (imageRedux.background)
      result = process.env.storageUrl + "/pet_background/" + imageRedux.background + "?" + Math.random();
    return result;
  };

  useEffect(() => {
    const item = document?.getElementById(parseInt(router?.query?.id));
    const offset = item?.offsetTop;
    if (typeof offset === "number") {
      router.push({ pathname: `/moje-zver/zvire/[slug]/vakciny`, query: { slug: pet.id } });
    }
  }, [vaccines]);

  const handleValidDate = (applyDate, valid) => {
    var lastDay = new Date(applyDate);
    valid >= 0 && lastDay.setTime(lastDay.getTime() + valid * oneDay);
    new Date(lastDay) >= new Date(Date.now()) && lastDay.setTime(lastDay.getTime() - 1 * oneDay);
    return lastDay?.toISOString()?.slice(0, 10);
  };

  return (
    <Layout bodyClass="vaccines" registrationPromo={false}>
      <div className="vaccinesContainer">
        <>
          <div className="petBackground">
            <div className="actions">
              <div className="top">
                <div className="flexContainer">
                  <ToggleModalContent
                    toggle={(show) => (
                      <ImageButton
                        show={show}
                        text={"Změnit pozadí"}
                        sign={sign1}
                        passClass="dark"
                        color="white"
                        border={true}
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
                  <ToggleModalContent
                    toggle={(show) => (
                      <div onClick={show}>
                        <ImageButton
                          passClass="dark"
                          color="white"
                          text="Přepnout na jiné zvířátko"
                          cursor="pointer"
                          fontWeight="bold"
                        />
                      </div>
                    )}
                    content={(hide) => <PetPickModal pet={pet} title="Přepnout na jiné zvířátko" hide={hide} />}
                  />
                  <Link href="/moje-zver/vytvorit">
                    <a href="/moje-zver/vytvorit">
                      <ImageButton
                        text={"Přidat další zvířátko"}
                        sign={sign3}
                        passClass="dark"
                        imgPosition="left"
                        color="white"
                        cursor="pointer"
                        border2px={true}
                        fontWeight="bold"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="vaccineBackground"
              alt="Fotografie zvířátka"
              style={{
                backgroundImage: `url(${imageSwitch()})`,
                backgroundSize: (pet && pet?.background) || imageRedux.background ? "100% 100%" : "50%",
                backgroundPosition: "100% 100%",
                backgroundColor: "#c7dbeb",
              }}
            />
          </div>

          <section className="topSection">
            <div className="petInfo">
              <div className="petIcons">
                <ToggleModalContent
                  toggle={(show) => (
                    <img
                      alt="change-pet"
                      className="sideIcon"
                      src="/icons/repeat-light.svg"
                      onClick={() => show()}
                    ></img>
                  )}
                  content={(hide) => <PetPickModal pet={pet} title="Vaše zvířátka" hide={hide} />}
                />
                <PetIcon pet={pet} color="#fd8985" />
                <Link href="/moje-zver/vytvorit">
                  <a href="/moje-zver/vytvorit">
                    <img alt="add-pet" className="sideIcon" src="/icons/plus-circle-light.svg"></img>
                  </a>
                </Link>
              </div>
              <div className="petInfoInner">
                <h1>{pet?.pet_name}</h1>
                <a href={"/moje-zver/zvire/" + pet?.id + "/upravit"}>
                  <ImageButton color="white" cursor="pointer" text={text1} sign={sign1} />
                </a>
              </div>
            </div>
          </section>
          <div className="tableTop">
            <div className="vaccinesButtons">
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

              <h1>Očkování</h1>
              <ToggleModalContent
                toggle={(show) => (
                  <div className="holder" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="wrap" style={{ display: "flex" }} onClick={show}>
                      <ImageButton
                        passClass="tableButtons"
                        sign={sign2}
                        text="Nové očkování"
                        imgPosition="left"
                        id="addTerm"
                        cursor="pointer"
                        color="#838383"
                      />
                    </div>
                  </div>
                )}
                content={(hide) => (
                  <VaccineModal
                    type="add"
                    pet={pet}
                    vetMetaArray={vetsWithDistance}
                    vetsArray={vetsArray}
                    title="Nové očkování"
                    hide={hide}
                    close={setVaccinesUpdated}
                  />
                )}
              />
            </div>
          </div>
        </>
        <div className="vaccinesList">
          {vaccines?.length > 0 && (
            <div className="firstRow">
              <div className="name">Název</div>
              <div className="date">Očkováno</div>
              <div className="date">Platné do</div>
              <div className="placeHolder">&nbsp;</div>
            </div>
          )}
          {vaccines &&
            vaccines?.map((item, index) => (
              <div
                key={`a${index}`}
                className={setName(handleValid(item.apply_date, item.valid))}
                id={item.id}
                name={index}
              >
                <div className="basic" key={`basic${item.id}`} onClick={() => toggleClass(item.id)}>
                  <div className="description" key={`description${index}`}>
                    {item.description}
                  </div>
                  <div className="date" key={`dateA${index}`}>
                    {formatTimestamp(item.apply_date)}
                  </div>
                  <div className="date" key={`dateB${index}`}>
                    {formatTimestamp(handleValidDate(item.apply_date, item.valid))}
                  </div>

                  <div className="icons" key={`icons${index}`}>
                    <ToggleModalContent
                      toggle={(show) => (
                        <div className="sign" key={`sign${index}`} id={`edit${item.description}`}>
                          <img onClick={show} src="/pen-solid-white.svg" alt="edit" key={`edit1${index}`}></img>
                        </div>
                      )}
                      content={(hide) => (
                        <VaccineModal
                          type="edit"
                          editVaccine={item}
                          pet={pet}
                          vetsArray={vetsArray}
                          vetMetaArray={vetsWithDistance}
                          selectedDoctor={item?.doctor_id}
                          title="Upravit očkování"
                          hide={hide}
                          close={setVaccinesUpdated}
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
                          title="Odstranit očkování"
                          hide={hide}
                          removal="vaccine"
                          content="Skutečně chcete smazat tento záznam očkování?"
                          close={setVaccinesUpdated}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="advanced" key={`advanced${item.id}`}>
                  <div className="line"></div>
                  <div className="content">
                    <div className="center">
                      <div className="head">Údaje</div>
                      <div className="flex-content">
                        <div className="infos">
                          <div className="info">
                            <div className="label">Výrobce: </div>
                            <div className="text">{item.company ? item.company : "-"}</div>
                          </div>
                          <div className="info">
                            <div className="label">Název: </div>
                            <div className="text">{item.name ? item.name : "-"}</div>
                          </div>
                          <div className="info">
                            <div className="label">Cena: </div>
                            <div className="text">{item.price ? item.price + " Kč" : "-"}</div>
                          </div>
                        </div>
                        <div className="notes">
                          <div className="label">Poznámky: </div>
                          <div className="text">
                            {item.notes ? (
                              item.notes
                            ) : (
                              <ToggleModalContent
                                toggle={(show) => (
                                  <div
                                    onClick={show}
                                    style={{
                                      width: "100%",
                                      height: "9rem",
                                      backgroundColor: "#eeeeee",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      borderRadius: "5px",
                                      color: "#969696",
                                      fontSize: "20px",
                                    }}
                                  >
                                    žádné poznámky k očkování
                                  </div>
                                )}
                                content={(hide) => (
                                  <VaccineModal
                                    type="edit"
                                    editVaccine={item}
                                    pet={pet}
                                    vetsArray={vetsArray}
                                    vetMetaArray={vetsWithDistance}
                                    selectedDoctor={item?.doctor_id}
                                    title="Upravit očkování"
                                    hide={hide}
                                    close={setVaccinesUpdated}
                                  />
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="right">
                      <div className="inner">
                        <div className="head">Vakcína</div>
                        <div className="vaccine">
                          <div
                            className="image"
                            key={`image${index}`}
                            style={
                              handleValid(item.apply_date, item.valid) > 30
                                ? { backgroundImage: `url('/images/vaccines/vaccine.svg')` }
                                : { backgroundImage: `url('/images/vaccines/vaccine-red.svg')` }
                            }
                          >
                            <p>Platnost</p>
                            <p>{handleValid(item.apply_date, item.valid)}&nbsp;dní</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="notes outside">
                      <div className="label">Poznámky: </div>
                      {item.notes ? (
                        item.notes
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "3rem",
                            backgroundColor: "#eeeeee",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            borderRadius: "5px",
                            color: "#969696",
                          }}
                        >
                          žádné poznámky k očkování
                        </div>
                      )}
                    </div>
                    <div className="icons" key={`icons${index}`}>
                      <ToggleModalContent
                        toggle={(show) => (
                          <div className="sign" key={`sign${index}`} id={`edit${item.description}`}>
                            <img onClick={show} src="/pen-solid-white.svg" alt="edit" key={`edit1${index}`}></img>
                          </div>
                        )}
                        content={(hide) => (
                          <VaccineModal
                            type="edit"
                            editVaccine={item}
                            pet={pet}
                            vetsArray={vetsArray}
                            vetMetaArray={vetsWithDistance}
                            selectedDoctor={item?.doctor_id}
                            title="Upravit očkování"
                            hide={hide}
                            close={setVaccinesUpdated}
                          />
                        )}
                      />
                      <ToggleModalContent
                        toggle={(show) => (
                          <div className="sign" id={`delete${item.description}`}>
                            <img alt="delete-record" onClick={show} src="/trash-alt-light.svg"></img>
                          </div>
                        )}
                        content={(hide) => (
                          <DeleteModal
                            id={item.id}
                            petId={router.query.slug}
                            title="Odstranit očkování"
                            hide={hide}
                            removal="vaccine"
                            content="Skutečně chcete smazat tento záznam očkování?"
                            close={setVaccinesUpdated}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};
export default Vaccines;
