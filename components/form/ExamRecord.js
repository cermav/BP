import React, {useState} from "react";
import Billing from "../calendar/record/Billing";
import {formatTimestamp} from "../../helpers/formatTimestamp";
import moment from "moment";

const ExamRecord = (props) => {
    const [record, setRecord] = useState("");
    const [time, setTime] = useState("");
    const [billingItems, setBillingItems] = useState([]);

    const handleBilling = (items) => {
        setBillingItems(items);
    }

    const submit = (e) => {
        e.preventDefault();
        const recordObject = {
            description: props.event.title,
            medical_record: record,
            billing_items: billingItems.filter((item) => item.count > 0),
            time: time
        }
        props.submit(recordObject);
        //close
    }

    return (
        <form onSubmit={submit}>
            <h3>Popis</h3>
            <div style={{
                width: "100%",
                color: "white",
                textAlign: "left",
                margin: "1rem 0",
                marginLeft: "2rem",
            }}>{props.event.title}</div>

            <h3>Zákazník</h3>
            <div style={{
                width: "100%",
                color: "white",
                textAlign: "left",
                margin: "1rem 0",
                marginLeft: "2rem",
            }}>{props.event.name} {props.event.surname}</div>

            <h3>E-mail</h3>
            <div style={{
                width: "100%",
                color: "white",
                textAlign: "left",
                margin: "1rem 0",
                marginLeft: "2rem",
            }}>{props.event.mail}</div>
            {props.event.phone && (
                <>
                    <h3>Telefon</h3>
                    <div style={{
                        width: "100%",
                        color: "white",
                        textAlign: "left",
                        margin: "1rem 0",
                        marginLeft: "2rem",
                    }}>{props.event.phone}</div>
                </>
            )}
            <h3>Datum</h3>
            <div style={{
                width: "100%",
                color: "white",
                textAlign: "left",
                margin: "1rem 0",
                marginLeft: "2rem",
            }}>{
                formatTimestamp(props.event.date)
            }</div>

            <h3>Čas vyšetření</h3>
            <div style={{
                width: "100%",
                textAlign: "left",
                margin: "1rem 0",
                marginLeft: "2rem",
            }}>{
                props.event.start === props.event.date ?
                    <input type="time" onChange={(e) => setTime(e.target.value)}/> :
                    <span style={{
                        color: "white"
                    }}>moment(props?.event?.start)?.format("HH:mm")</span>
            }</div>

            <div /*className={errors.date && "error"}*/>
                <h3>Lékařská zpráva</h3>
            </div>

            <textarea
                /*className={errors.description && "error-input"}*/
                className="record"
                name="record"
                id="record"
                rows="5"
                onChange={(e) => setRecord(e.target.value)}
                defaultValue={record}
                /*ref={register({ required: true, maxLength: 191 })}*/
            />

            <div /*className={errors.date && "error"}*/>
                <h3>Položky k vyúčtování</h3>
            </div>
            <Billing doctorId={props.doctorId} setBillingItems={handleBilling}/>

            <div className="buttons">
                <input type="button" className="back" onClick={() => props.cancel()} value="Zrušit"></input>
                <input
                    key="submitTerm"
                    className="submit"
                    type="submit"
                    value="Změnit"
                    id="submit"
                    //onClick={() => !date && (errors.date = "date required!")}
                ></input>
            </div>
        </form>
    );
};

export default ExamRecord;
