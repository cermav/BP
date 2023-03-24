import TransparentModal from "../TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { useForm } from "react-hook-form";
import { withNotie } from "react-notie";
import router from "next/router";
import ExamRecord from "../../form/ExamRecord";
import VetUpdateEvent from "../../form/event/VetUpdateEvent";

const ControlEventVetModal = (props) => {
  console.log(props);
  /**
   * constants
   */
  const currentDoctorId = router.query.slug;

  const contentOptions = {
    OPTIONS: 1,
    UPDATE_FORM: 2,
    CREATE_RECORD_FORM: 3,
    CONFIRM_DELETE: 4,
  };

  const eventStatus = {
    ACCEPT: "accept",
    DENY: "deny",
  };

  /**
   * hooks
   */
  const { handleSubmit, errors, register } = useForm();

  const [modalContent, setModalContent] = useState(contentOptions.OPTIONS);

  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);

  const updateEvent = async (appointment) => {
    try {
      const response = await fetch(`${process.env.apiURL}${currentDoctorId}/event/doctor/update/${props.event.id}`, {
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

  const createEventRecord = async (record) => {
    const response = await fetch(`${process.env.apiURL}record/${props.event.id}/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader(),
      },
      body: JSON.stringify(record)
    });

    await response();
  };

  const sendAcceptOrDenyRequest = async (decision) => {
    try {
      const response = await fetch(
        `${process.env.apiURL}${currentDoctorId}/event/doctor/${decision}/${props.event.id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        }
      );

      const result = await response.json();

      if (result.errors) throw new Error(result.errors);
      else {
        props.notie.success(`Úspěšně ${decision === eventStatus.ACCEPT ? "potvrzeno" : "odmítnuto"}!`);
        props.close(Date.now());
        props.hide();
      }
    } catch (error) {
      props.notie.error(error);
      console.log("error: " + error);
    }
  };

  const submitDeleteEvent = async () => {
    try {
      const response = await fetch(`${process.env.apiURL}${currentDoctorId}/event/doctor/${props.event.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });

      const result = await response.json();

      if (result.errors) throw new Error(result.errors);
      else {
        props.notie.success("Úspěšně vytvořeno!");
        props.close(Date.now());
        props.hide();
      }
    } catch (error) {
      props.notie.error(error);
      console.log("error: " + error);
    }
  };

  const getTitle = () => {
    switch (modalContent) {
      case contentOptions.UPDATE_FORM:
        return "Upravit termín";
        break;

      case contentOptions.CREATE_RECORD_FORM:
        return "Vytvořit záznam z vyšetření";
        break;

      case contentOptions.CONFIRM_DELETE:
        return "Skutečně chcete odstranit tento termín?";
        break;

      case contentOptions.OPTIONS:
      default:
        return "Račte si přát?";
        break;
    }
  };

  const getActionsOptions = () => {
    return (
      <div className="menu buttons">
        {props.event.assigned_to === parseInt(currentDoctorId) && (
          <>
            <h3>
              <button onClick={() => sendAcceptOrDenyRequest(eventStatus.ACCEPT)}>Přijmout</button>
            </h3>
            <h3>
              <button onClick={() => sendAcceptOrDenyRequest(eventStatus.DENY)}>Odmítnout</button>
            </h3>
          </>
        )}

        <h3>
          <button onClick={() => setModalContent(contentOptions.UPDATE_FORM)}>Upravit</button>
        </h3>

        <h3>
          <button onClick={() => setModalContent(contentOptions.CREATE_RECORD_FORM)}>
            vytvořit záznam z vyšetření
          </button>
        </h3>
        <h3>
          <button onClick={() => setModalContent(contentOptions.CONFIRM_DELETE)}>smazat</button>
        </h3>
      </div>
    );
  };

  const getModalContent = () => {
    switch (modalContent) {
      case contentOptions.UPDATE_FORM:
        return (
          <VetUpdateEvent
            event={props.event}
            dateObj={props.dateObj}
            submit={updateEvent}
            cancel={() => setModalContent(contentOptions.OPTIONS)}
          />
        );
        break;

      case contentOptions.CREATE_RECORD_FORM:
        return (
          <ExamRecord
            event={props.event}
            submit={createEventRecord}
            cancel={() => setModalContent(contentOptions.OPTIONS)}
            doctorId={currentDoctorId}
          />
        );
        break;

      case contentOptions.CONFIRM_DELETE:
        return (
          <div className="menu buttons">
            <h3>
              <button onClick={() => submitDeleteEvent()}>Potvrdit</button>
            </h3>
            <h3>
              <button onClick={() => setModalContent(contentOptions.OPTIONS)}>Zrušit</button>
            </h3>
          </div>
        );

      case contentOptions.OPTIONS:
      default:
        return getActionsOptions();
        break;
    }
  };

  return (
    <TransparentModal
      hasBackdrop={true}
      passClass={["modalBlack appointmentModal"]}
      title={getTitle()}
      hide={props.hide}
    >
      <div className="container">{getModalContent()}</div>
    </TransparentModal>
  );
};

export default withNotie(ControlEventVetModal);
