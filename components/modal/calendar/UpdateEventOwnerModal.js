import TransparentModal from "../TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { useForm } from "react-hook-form";
import SafariDate from "../../../helpers/SafariDate";
import Bowser from "bowser";
import { withNotie } from "react-notie";
import moment from "moment/moment";
import VetSearch from "../../form/VetSearch";
import router from "next/router";
import PetListIcon from "../../myPets/pet/PetListIcon";
import { prototype } from "react-image-crop";

const UpdateEventOwnerModal = (props) => {
  moment.locale("cs");

  const browser = Bowser.getParser(window.navigator.userAgent);

  const initialStartTime =
    props?.event?.date === props?.event?.start ? null : moment(props?.event?.start)?.format("HH:mm");

  const initialEndTime = props?.event?.date === props?.event?.end ? null : moment(props?.event?.end)?.format("HH:mm");

  const { handleSubmit, errors, register } = useForm();
  const [date, setDate] = useState(moment(props?.event?.date).format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [title, setTitle] = useState(props.event.title);
  const [vetId, setVetId] = useState(props.event.doctor_id);
  const [petId, setPetId] = useState(props.event?.pet_id);
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
      if (
        title === props.event.title &&
        date === props.event.date &&
        startTime === initialStartTime &&
        endTime === initialEndTime &&
        vetId === props.event.doctor_id &&
        petId === props.event.pet_id
      ) {
        return props.hide();
      }

      const appointment = {
        title: title,
        date: date,
        startTime: startTime ? startTime : null,
        endTime: endTime ? startTime : null,
        doctor_id: vetId,
        pet_id: petId,
      };

      const response = await fetch(`${process.env.apiURL}${router.query.slug}/event/member/update/${props.event.id}`, {
        method: "PUT",
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
      title="Upravit termín"
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
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
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
                  <VetSearch setVetId={setVetId} vetId={vetId} />
                </div>
              </>
            )}
          </div>

          <div className="buttons">
            <input type="button" className="back" onClick={() => props.hide()} value="Zrušit"></input>
            <input
              key="submitTerm"
              className="submit"
              type="submit"
              value="Změnit"
              id="submit"
              onClick={() => !date && (errors.date = "date required!")}
            ></input>
          </div>
        </form>
      </div>
    </TransparentModal>
  );
};

export default withNotie(UpdateEventOwnerModal);
