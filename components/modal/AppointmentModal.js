import TransparentModal from "./TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader, getUserId } from "../../services/AuthToken";
import { useForm } from "react-hook-form";
import { formatTimestamp } from "../../helpers/formatTimestamp";
import SafariDate from "../../helpers/SafariDate";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Bowser from "bowser";
import { withNotie } from "react-notie";

const AppointmentModal = (props) => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const { handleSubmit, errors, register } = useForm();
  const type = props.type;
  const hide = props.hide ? props.hide : null;
  const title = props.title ? props.title : null;
  const notification = props.notification ? props.notification : null;
  const editAppointment = props.appointment ? props.appointment : null;
  const id = props.id ? props.id : null;
  const vetsWithDistance = props?.vetMetaArray;
  const vetsArray = props.vetsArray ? props.vetsArray : null;
  const [allVets, setAllVets] = useState(
    typeof window === "object" && window.localStorage && window.localStorage.getItem("searchVets") !== "undefined"
      ? JSON.parse(window.localStorage.getItem("searchVets"))
      : []
  );
  const [date, setDate] = useState(props?.appointment?.date ? props.appointment.date : null);
  const [selectedDoctor, setSelectedDoctor] = useState(props.selectedDoctor ? props.selectedDoctor : null);
  const [doctor, setDoctor] = useState(editAppointment ? editAppointment?.doctor_id : null);
  const [currentId, setCurrentId] = useState(editAppointment ? editAppointment?.doctor_id : null);
  const [vetSearch, setVetSearch] = useState(false);

  useEffect(() => {
    if (currentId && document.getElementById(currentId))
      document.getElementById(currentId).className = "vetMeta selected";
  }, [(vetSearch, selectedDoctor, document?.getElementById(currentId)), currentId]);
  const [description, setDescription] = useState(
    props.appointment && props.appointment.description ? props.appointment.description : null
  );
  const handlePropVet = () => {
    if (editAppointment && vetsArray) {
      const vetIds = vetsArray?.map((vet) => vet.id);
      if (!vetIds) return;
      const vetFound = vetIds?.includes(editAppointment?.doctor_id);
      return !vetFound;
    }
  };
  const handleCurrentId = (id) => {
    if (id === currentId) {
      setCurrentId(null);
      setDoctor(null);
    } else {
      setCurrentId(id);
      setDoctor(id);
    }
  };
  const handleVetOnSelect = (item) => {
    setDoctor(item.user_id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(process.env.apiURL + "doctors-search", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseArray = await response.json();
      setAllVets(responseArray);
      if (typeof window === "object" && window.localStorage)
        window.localStorage.setItem("searchVets", JSON.stringify(responseArray));
    };
    if (typeof window === "object") window.scrollTo({ top: 0 });
    if (allVets === null || allVets?.length === 0) fetchData();
  }, []);

  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);
  const onSubmit = async () => {
    try {
      if (!date) return;
      if (type === "add") {
        const appointment = {
          date: formatTimestamp(date),
          description: description,
          doctor_id: doctor ? doctor : null,
        };
        const response = await fetch(`${process.env.apiURL}pets/${props.pet.id}/appointment/store`, {
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
        if (notification) {
          const response = await fetch(process.env.apiURL + "vaccine/" + props.pet.id + "/setSeen/" + id, {
            method: "put",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: getAuthorizationHeader(),
            },
          });
          const result = await response.json();
          if (result.errors) throw new Error(result.errors);
          props.notie.success("Úspěšně vytvořeno!");
          props.close(Date.now());
          hide();
        } else {
          props.notie.success("Úspěšně vytvořeno!");
          props.close(Date.now());
          hide();
        }
      } else if (type === "edit") {
        const appointment = {
          date: formatTimestamp(date),
          title: description,
          doctor_id: doctor ? doctor : null,
        };
        const response = await fetch(
          process.env.apiURL + "pets/" + props.pet.id + "/appointment/" + props.appointment.id + "/update",
          {
            method: "put",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: getAuthorizationHeader(),
            },
            body: JSON.stringify(appointment),
          }
        );
        const result = await response.json();
        if (result.errors) throw new Error(result.errors);
        props.notie.success("Úspěšně upraveno!");
        props.close(Date.now());
        hide();
      }
    } catch (error) {
      props.notie.error(error);
      console.log("error: " + error);
    }
  };
  return (
    <TransparentModal hasBackdrop={true} passClass={["modalBlack appointmentModal"]} title={title} hide={props.hide}>
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

          <div className={errors.date && "error"}>
            <h3>Datum termínu</h3>
          </div>

          <div className="date">
            {browser.getBrowserName() === "Safari" ? (
              <SafariDate error={errors.date} setDate={setDate} date={date} />
            ) : (
              <input
                type="date"
                name="date"
                className={errors.date ? "modal-date error-input" : "modal-date"}
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                ref={register({ required: true })}
              />
            )}
          </div>

          <div className="buttons">
            <input type="button" className="back" onClick={() => hide()} value="Zrušit"></input>
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
                value="Změnit"
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

export default withNotie(AppointmentModal);
