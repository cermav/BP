import TransparentModal from "../TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { useForm } from "react-hook-form";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import SafariDate from "../../../helpers/SafariDate";
import Bowser from "bowser";
import { withNotie } from "react-notie";
import moment from "moment/moment";
import VetSearch from "../../form/VetSearch";
import router from "next/router";
import PetListIcon from "../../myPets/pet/PetListIcon";

const CreateEventOwnerModal = (props) => {
  moment.locale("cs");

  const allDayViews = ["dayGridMonth"];

  const browser = Bowser.getParser(window.navigator.userAgent);

  const { handleSubmit, errors, register } = useForm();
  const type = props.type;
  const [date, setDate] = useState(moment(props?.dateObj?.dateStr).format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(
    props?.viewType && !allDayViews.includes(props?.viewType) ? moment(props?.dateObj?.dateStr).format("HH:mm") : null
  );
  const [endTime, setEndTime] = useState(
    props?.viewType && !allDayViews.includes(props?.viewType)
      ? moment(props?.dateObj?.dateStr).add(1, "h").format("HH:mm")
      : null
  );
  const [description, setDescription] = useState(
    props.appointment && props.appointment.description ? props.appointment.description : null
  );
  const [vetId, setVetId] = useState(null);
  const [petId, setPetId] = useState(null);
  const [petList, setPetList] = useState([]);

  useEffect(() => {
    const fetchPetList = async () => {
      const response = await fetch(process.env.apiURL + "pets/list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      if (response.status === 401) return router.replace("../../../login");
      const responseObject = await response.json();

      setPetList(responseObject);
    };

    fetchPetList();
  }, []);

  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);

  const onSubmit = async () => {
    if (!date) return;

    try {
      const appointment = {
        title: description,
        date: date,
        startTime: startTime,
        endTime: endTime,
        doctor_id: vetId,
        pet_id: petId,
      };

      const response = await fetch(`${process.env.apiURL}${router.query.slug}/event/member/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify(appointment),
      });

      const result = await response.json();

      if (result.errors) throw new Error(result.errors);
      else props.notie.success("Úspěšně vytvořeno!");
      props.close(Date.now());
      props.hide();
    } catch (error) {
      props.notie.error(error);
      console.log("error: " + error);
    }
  };

  return (
    <TransparentModal
      hasBackdrop={true}
      passClass={["modalBlack appointmentModal"]}
      title="Vytvořit termín"
      hide={props.hide}
    >
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={errors.description && "error"}>
            <h3>Popis</h3>
          </div>
          <input
            className={errors.description && "error-input"}
            name="description"
            id="description"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            defaultValue={description}
            ref={register({ required: true, maxLength: 191 })}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            {petList &&
              petList.map((pet) => (
                <div
                  style={{ display: "flex", flexDirection: "column", alignContent: "center", cursor: "pointer" }}
                  onClick={() => setPetId(pet.id)}
                >
                  <h4 style={{ color: "white" }}>{pet.pet_name}</h4>

                  <PetListIcon
                    name={pet.pet_name}
                    color={petId === pet.id ? "#4ea7ff" : "#fd8985"}
                    imageUrl={
                      pet.avatar ? process.env.storageUrl + "/pet_avatar/" + pet.avatar : "/images/favicon-original.png"
                    }
                  />
                </div>
              ))}
          </div>

          <div className={errors.date && "error"}>
            <h3>Datum termínu</h3>
          </div>

          <div className="date">
            {browser.getBrowserName() === "Safari" ? (
              <SafariDate error={errors.date} setDate={setDate} date={props?.dateObj?.dateStr} />
            ) : (
              <>
                <input
                  type="date"
                  name="date"
                  className={errors.date ? "modal-date error-input" : "modal-date"}
                  defaultValue={date}
                  onChange={(e) => setDate(e.target.value)}
                  ref={register({ required: true })}
                />

                <h3>Začátek termínu</h3>
                <div style={{ display: "flex" }}>
                  <input
                    name="startTime"
                    type="time"
                    defaultValue={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <h3>Konec termínu</h3>
                <div style={{ display: "flex" }}>
                  <input
                    name="endTime"
                    type="time"
                    defaultValue={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex" }}>
                  <VetSearch setVetId={setVetId} />
                </div>
              </>
            )}
          </div>

          <div className="buttons">
            <input type="button" className="back" onClick={() => props.hide()} value="Zrušit"></input>
            {type === "add" ? (
              <input
                key="submitTerm"
                className="submit"
                type="submit"
                value="Přidat"
                id="submit"
                onClick={() => !date && (errors.date = "date required!")}
              ></input>
            ) : (
              <input
                key="submitTerm"
                className="submit"
                type="submit"
                value="Vytvořit"
                id="submit"
                onClick={() => !date && (errors.date = "date required!")}
              ></input>
            )}
          </div>
        </form>
      </div>
    </TransparentModal>
  );
};

export default withNotie(CreateEventOwnerModal);
