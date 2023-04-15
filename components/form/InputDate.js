import DatePicker from "react-datepicker";
import {isSafari} from "../../helpers/bowser";

export default function InputDate({date, setDate, errors, name, register, id}) {
    console.log(register)
    return isSafari() ?
        <>
            <div className={errors ? "safari-input-error" : "modal-date"}>
                <DatePicker
                    placeholderText="Zadejte datum"
                    selected={new Date(date)}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd.MM.yyyy"
                />
            </div>
        </>
        :
        <>
            <input
                type="date"
                name={name}
                id={id}
                className={errors ? "modal-date error-input" : "modal-date"}
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                ref={register && register({required: true})}
            />
        </>
}
