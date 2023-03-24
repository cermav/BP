import React, { useEffect, useState } from "react";
import ToggleModalContent from "../../modal/ToggleModalContent";
import AppointmentModal from "../../modal/AppointmentModal";
import DeleteModal from "../../modal/DeleteModal";
import { calculateDistance } from "../../../helpers/calculateDistance";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import ImageButton from "../../ImageButton";
import {getUsersLocation, coordsFromLS, addDistances} from "../../../helpers/geoLocation";
const Notifications = (props) => {
  const pet = props.pet ? props.pet : null;
  const [vetsWithDistance, setVetsWithDistance] = useState(null);
  const [vetsArray, setVetsArray] = useState([]);
  const [userCoordinates, setuserCoordinates] = useState(false);
  const [expand, setExpand] = useState(false);
  const [notificationsUpdated, setNotificationsUpdated] = useState(Date.now());
  const [vaccines, setVaccines] = useState(props.vaccines ? props.vaccines : null);
  const [UnseenVaccines, setUnseenVaccines] = useState(null);

  useEffect(() => {
    const result = vaccines
      .filter((item) => item.seen === 0)
      .filter((item) => {
        const oneDay = 24 * 60 * 60 * 1000;
        var result = new Date(item.apply_date);
        result.setTime(result.getTime() + item.valid * oneDay);
        const daysLeft = (result - new Date(Date.now())) / oneDay;
        return daysLeft < 30;
      });
    setUnseenVaccines(result);
  }, [vaccines]);

  useEffect(() => {
    if (pet) {
      const fetchVaccines = async () => {
        const result = await fetch(process.env.apiURL + "vaccine/" + pet?.id + "/vaccines", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await result.json();
        if (result.status === 401) return router.replace("../../../login");
        setVaccines(responseObject);
      };
      fetchVaccines();
    }
  }, [notificationsUpdated]);

  useEffect(() => {
    getUsersLocation();
    coordsFromLS && setVetsWithDistance(coordsFromLS());
    vetsArray && setVetsWithDistance(addDistances(vetsArray, userCoordinates));
  }, [vetsArray]);

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
  }, [pet]);

  const calculate = (applyDate, valid) => {
    const oneDay = 24 * 60 * 60 * 1000;
    var result = new Date(applyDate);
    result.setTime(result.getTime() + valid * oneDay);
    const daysLeft = (result - new Date(Date.now())) / oneDay;
    return `Zbývá ${Math.round(daysLeft)} dní`;
  };
/*
  const endDate = (applyDate, valid) => {
    const oneDay = 24 * 60 * 60 * 1000;
    var result = new Date(applyDate);
    result.setTime(result.getTime() + valid * oneDay);
    var date = new Date(result);
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month + 1;
    var day = date.getDate();
    if (day < 10) day = "0" + day.toString();
    if (month < 10) month = "0" + month.toString();
    return year + "-" + month + "-" + day;
  };*/
  return (
    <>
      {vaccines && vaccines.length > 0 && (
        <div className="petNotifications">
          <div key={Math.random()} className="petNotificationsInner">
            {/* TODO: Add the nice bell icon */}
            <h3>
              <ImageButton
                key="modalToogle"
                sign="/icons/bells-solid-white.svg"
                text="Upozornění"
                imgPosition="left"
                id="addTerm"
                color="white"
                fontWeight="bold"
              />
            </h3>
            <table className="petNotificationList">
              <thead>
                {UnseenVaccines &&
                  UnseenVaccines.slice(0, expand ? UnseenVaccines.length : 3).map((item) => (
                    <React.Fragment key={notificationsUpdated}>
                      <tr key={Math.random()} className="termIsClose">
                        <td key={Math.random()} className="name">
                          {item.description}
                        </td>
                        <td key={Math.random()} className="interval">
                          {calculate(item.apply_date, item.valid)}
                        </td>
                        <td className="icons" style={{ display: "flex", justifyContent: "flex-end" }}>
                          <ToggleModalContent
                            toggle={(show) => (
                              <a onClick={show} id="addTerm">
                                <img className="icon" src="/icons/plus-circle-light.svg"></img>
                              </a>
                            )}
                            content={(hide) => (
                              <AppointmentModal
                                type="add"
                                pet={pet}
                                notification
                                key="addModal"
                                id={item.id}
                                vetsArray={vetsArray}
                                vetMetaArray={vetsWithDistance}
                                id={item.id}
                                appointment={{
                                  description: item.description,
                                }}
                                close={setNotificationsUpdated}
                                title="Přidat termín"
                                hide={hide}
                              />
                            )}
                          />
                          <ToggleModalContent
                            toggle={(show) => (
                              <a onClick={show} id="removeNotification">
                                <img
                                  className="icon"
                                  style={{ transform: "rotate(45deg)" }}
                                  src="/icons/plus-circle-light.svg"
                                ></img>
                              </a>
                            )}
                            content={(hide) => (
                              <DeleteModal
                                title="Odstranit upozornění"
                                content="Skutečně chcete odstranit toto upozornění?"
                                removal="notification"
                                petId={pet.id}
                                key="removeNotification"
                                id={item.id}
                                hide={hide}
                                close={setNotificationsUpdated}
                              />
                            )}
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </thead>
            </table>
            <div className="actions">
              <div className="flexContainer">
                <div
                  id="addTerm"
                  onClick={() => setExpand(!expand)}
                  style={UnseenVaccines?.length <= 3 ? { display: "none" } : {}}
                >
                  <ImageButton
                    key="modalToogle"
                    text={expand ? "Zobrazit méně" : "Zobrazit více"}
                    imgPosition="left"
                    id="addTerm"
                    cursor="pointer"
                    color="white"
                    fontWeight="bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Notifications;
