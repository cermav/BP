import TransparentModal from "../TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import { useForm } from "react-hook-form";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import { withNotie } from "react-notie";
import moment from "moment/moment";
import router from "next/router";
import getBrowser from "../../../helpers/bowser";
import InputDate from "../../form/InputDate";

const CreateEventVetModal = (props) => {
  moment.locale("cs");

  const allDayViews = ["dayGridMonth"];

  const { handleSubmit, errors, register } = useForm();
  const [date, setDate] = useState(moment(props?.dateObj?.dateStr).format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(
    props?.viewType && !allDayViews.includes(props?.viewType) ? moment(props?.dateObj?.dateStr).format("HH:mm") : null
  );
  const [endTime, setEndTime] = useState(
    props?.viewType && !allDayViews.includes(props?.viewType)
      ? moment(props?.dateObj?.dateStr).add(1, "h").format("HH:mm")
      : null
  );
  const [title, setTitle] = useState(null);
  const [mail, setMail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [surName, setSurName] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);

  const onSubmit = async (event) => {
    if (!date) return;

    try {
      const appointment = {
        title: title,
        date: date,
        startTime: startTime,
        endTime: endTime,
        mail: mail,
        name: firstName,
        surname: surName,
        phone: phone,
      };

      const response = await fetch(`${process.env.apiURL}${router.query.slug}/event/doctor/create`, {
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
            name="title"
            id="title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
            ref={register({ required: true, maxLength: 191 })}
          />

          <div className={errors.description && "error"}>
            <h3>Jméno zákazníka</h3>
          </div>
          <input
            className={errors.description && "error-input"}
            name="name"
            id="name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            defaultValue={firstName}
            //ref={register({ required: true, maxLength: 191 })}
          />

          <div className={errors.description && "error"}>
            <h3>Příjmení zákazníka</h3>
          </div>
          <input
            className={errors.description && "error-input"}
            name="surname"
            id="surname"
            type="text"
            onChange={(e) => setSurName(e.target.value)}
            defaultValue={surName}
            //ref={register({ required: true, maxLength: 191 })}
          />

          <div className={errors.description && "error"}>
            <h3>Telefonní číslo</h3>
          </div>
          <input
            className={errors.description && "error-input"}
            name="phone"
            id="phone"
            type="text"
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={phone}
            //ref={register({ required: true, maxLength: 191 })}
          />

          <div className={errors.description && "error"}>
            <h3>E-mail</h3>
          </div>
          <input
            className={errors.description && "error-input"}
            name="mail"
            id="mail"
            type="text"
            onChange={(e) => setMail(e.target.value)}
            defaultValue={mail}
            //ref={register({ required: true, maxLength: 191 })}
          />

          <div className={errors.date && "error"}>
            <h3>Datum termínu</h3>
          </div>

          <div className="date">
            <InputDate date={date} setDate={setDate} name={"date"} register={register} errors={errors.date}/>

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
          </div>

          <div className="buttons">
            <input type="button" className="back" onClick={() => props.hide()} value="Zrušit"></input>
            <input
              key="submitTerm"
              className="submit"
              type="submit"
              value="Vytvořit"
              id="submit"
              onClick={() => !date && (errors.date = "date required!")}
            ></input>
          </div>
        </form>
      </div>
    </TransparentModal>
  );
};

export default withNotie(CreateEventVetModal);
