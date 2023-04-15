import Link from "next/link";
import Layout from "../../../layouts/Loggedin";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import PetIcon from "./PetIcon";
import RecordsModal from "../../modal/RecordsModal";
import DeleteModal from "../../modal/DeleteModal";
import ToggleModalContent from "../../modal/ToggleModalContent";
import ImageButton from "../../ImageButton";
import PetPickModal from "../../modal/PetPickModal";
import BackgroundModal from "../../modal/BackgroundModal";
import { calculateDistance } from "../../../helpers/calculateDistance";
import { withUserRoute } from "../../../components/hoc/withUserRoute";
import { useSelector } from "react-redux";

const Records = () => {
  const text1 = "Upravit";
  const sign1 = "/pen-solid.svg";
  const sign2 = "/plus-CE6668.svg";
  const sign3 = "/plus-regular.svg";
  const router = useRouter();
  const [records, setRecords] = useState(null);
  const imageRedux = useSelector((state) => state.pet);
  const [vetsArray, setVetsArray] = useState([]);
  const [userCoordinates, setuserCoordinates] = useState(false);
  const [vetsWithDistance, setVetsWithDistance] = useState(null);
  const [recordsUpdated, setRecordsUpdated] = useState(Date.now());
  const [pet, setPet] = useState(null);
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
        const result = await fetch(process.env.apiURL + "pets/" + pet?.id + "/records", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await result.json();
        if (result.status == 401) return router.replace("../../../login");
        const sortedObject = responseObject?.sort((a, b) => (a.date - b.date > 0 ? 1 : -1));
        setRecords(sortedObject);
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
  }, [pet, recordsUpdated]);
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
  const toggleClass = (id) => {
    const modal = document?.getElementById("modal");
    if (modal) return;
    const className = document?.getElementById(id)?.className;
    switch (className) {
      case "row":
        document.getElementById(id).className = "row open";
        break;
      case "row open":
        document.getElementById(id).className = "row";
        break;
      default:
        return;
    }
  };
  /*const download = (fileName, file_id) => {
    const fetchFile = async (file_id) => {
      const image = await fetch(process.env.apiURL.slice(0, -4) + "get-file/" + file_id, {
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: getAuthorizationHeader(),
        },
      });
      const blob = await image.blob();
      let src = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = src;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    fetchFile(file_id);
  };*/
  useEffect(() => {
    const item = document?.getElementById(parseInt(router?.query?.id));
    const offset = item?.offsetTop;
    if (typeof offset === "number") {
      router.push({ pathname: `/moje-zver/zvire/[slug]/zaznamy`, query: { slug: pet.id } });
    }
  }, [records]);

  const imageSwitch = () => {
    if (imageRedux.background) {
      return process.env.storageUrl + "/pet_background/" + imageRedux.background + "?" + Math.random();
    } else if (pet && pet?.background) {
      return process.env.storageUrl + "/pet_background/" + pet?.background;
    } else return "/images/elephant@2x.png";
  };
  /*const handleSign = (fileName) => {
    const extension = fileName.slice(-6);
    if (extension.includes("pdf")) return "/icons/file-pdf-light.svg";
    if (extension.includes("jpg")) return "/icons/file-image-light.svg";
    if (extension.includes("jpeg")) return "/icons/file-image-light.svg";
    if (extension.includes("png")) return "/icons/file-image-light.svg";
    if (extension.includes("svg")) return "/icons/file-image-light.svg";
    if (extension.includes("txt")) return "/icons/file-word-light.svg";
    if (extension.includes("doc")) return "/icons/file-word-light.svg";
    if (extension.includes("docx")) return "/icons/file-word-light.svg";
  };*/
  return (
    <Layout bodyClass="records" registrationPromo={false}>
      <div className="recordsContainer">
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
              className="recordsBackground"
              alt="Fotografie zvířátka"
              style={{
                backgroundImage: `url(${imageSwitch()})`,
                backgroundSize: pet?.background || imageRedux.background ? "100% 100%" : "50%",
                backgroundPosition: "100% 100%",
                backgroundColor: "#D0BDDD",
              }}
            />
          </div>

          <section className="topSection">
            <div className="petInfo">
              <div className="petIcons">
                <ToggleModalContent
                  toggle={(show) => (
                    <img
                      alt="changePet"
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
                    <img alt="addPet" className="sideIcon" src="/icons/plus-circle-light.svg"></img>
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
            <div className="recordsButtons">
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

              <h1>Záznamy</h1>
              <ToggleModalContent
                toggle={(show) => (
                  <div className="holder" style={{ display: "flex", justifyContent: "flex-end" }} id="createRecord">
                    <div className="wrap" style={{ display: "flex" }} onClick={show}>
                      <ImageButton
                        passClass="tableButtons"
                        sign={sign2}
                        text="Nový záznam"
                        imgPosition="left"
                        id="addRecord"
                        cursor="pointer"
                        color="#838383"
                      />
                    </div>
                  </div>
                )}
                content={(hide) => (
                  <RecordsModal
                    type="add"
                    pet={pet}
                    vetMetaArray={vetsWithDistance}
                    vetsArray={vetsArray}
                    title="Nový záznam"
                    hide={hide}
                    close={setRecordsUpdated}
                  />
                )}
              />
            </div>
          </div>
        </>
        <div className="recordsList">
          {records?.length > 0 && (
            <div className="firstRow">
              <div className="name">Název</div>
              <div className="date">Datum</div>
              <div className="placeHolder">&nbsp;</div>
            </div>
          )}
          {records?.map((item, index) => (
            <div key={`a${index}`} className="row" id={item.id}>
              <div
                className={item.doctor_id || item.notes || item.files.length > 0 ? "basic active" : "basic"}
                key={`basic${item.id}`}
                onClick={() => toggleClass(item.id)}
              >
                <div className="description" key={`description${index}`}>
                  {item.description}
                </div>
                <div className="date" key={`dateA${index}`}>
                  {formatTimestamp(item.date)}
                </div>
                <div className="icons" key={`icons${index}`}>
                  <ToggleModalContent
                    toggle={(show) => (
                      <div className="sign" key={`sign${index}`} id={`edit${item.description}`}>
                        <img onClick={show} src="/pen-solid.svg" alt="edit" key={`edit2${index}`}></img>
                      </div>
                    )}
                    content={(hide) => (
                      <RecordsModal
                        type="edit"
                        editRecord={item}
                        pet={pet}
                        vetsArray={vetsArray}
                        vetMetaArray={vetsWithDistance}
                        selectedDoctor={item?.doctor_id}
                        title="Upravit záznam"
                        hide={hide}
                        close={setRecordsUpdated}
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
                        removal="record"
                        content="Skutečně chcete smazat tento záznam očkování?"
                        close={setRecordsUpdated}
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
export default withUserRoute(Records);
