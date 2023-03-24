import { useForm } from "react-hook-form";
import { useState } from "react";
const step5 = (props) => {
  const [chipNumber, setChipNumber] = useState(null);
  const { handleSubmit, errors, register } = useForm();
  const onSubmit = () => {
    props.send();
  };
  return (
    <>
      <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Číslo čipu</h1>
        <p>
          <input
            type="text"
            id="chip_number"
            name="chip_number"
            maxLength="15"
            defaultValue={props.chipNumber}
            onChange={(e) => {
              props.setChipNumber(e.target.value);
              setChipNumber(e.target.value);
            }}
            ref={register({ required: false, maxLength: 15, pattern: /[0-9]/ })}
          />
          {errors.chip_number && <div className="errorDiv">pouze čísla, max. 15 míst</div>}
        </p>
        <label>nepovinné</label>
      </form>
    </>
  );
};
export default step5;
