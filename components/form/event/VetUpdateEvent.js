import React, {useState} from "react";
import {useForm} from "react-hook-form";
import moment from "moment/moment";
import getBrowser from "../../../helpers/bowser";
import InputDate from "../InputDate";

const VetUpdateEvent = (props) => {
    const browser = getBrowser();

    const initialStartTime =
        props?.event?.date === props?.event?.start ? null : moment(props?.event?.start)?.format("HH:mm");

    const initialEndTime = props?.event?.date === props?.event?.end ? null : moment(props?.event?.end)?.format("HH:mm");

    const {handleSubmit, errors, register} = useForm();

    /**
     * controlled form states
     */
    const [date, setDate] = useState(moment(props?.dateObj?.dateStr).format("YYYY-MM-DD"));
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState(initialEndTime);
    const [title, setTitle] = useState(props.event.title);
    const [mail, setMail] = useState(props.event?.mail);
    const [firstName, setFirstName] = useState(props.event?.name);
    const [surName, setSurName] = useState(props.event?.surname);
    const [phone, setPhone] = useState(props.event?.phone_number);

    const submitForm = () => {
        if (!date) return;

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

        props.submit(appointment);
    };

    return (
        <form onSubmit={handleSubmit(submitForm)}>
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
                ref={register({required: true, maxLength: 191})}
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
                <div style={{display: "flex"}}>
                    <input
                        name="startTime"
                        type="time"
                        defaultValue={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>

                <h3>Konec termínu</h3>
                <div style={{display: "flex"}}>
                    <input name="endTime" type="time" defaultValue={endTime}
                           onChange={(e) => setEndTime(e.target.value)}/>
                </div>
            </div>


            <div className="buttons">
                <input type="button" className="back" onClick={() => props.cancel()} value="Zrušit"></input>
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
    );
};

export default VetUpdateEvent;
