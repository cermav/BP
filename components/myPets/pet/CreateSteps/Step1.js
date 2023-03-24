import { useForm } from "react-hook-form";
const step1 = (props) => {
  const { handleSubmit, errors, register } = useForm();
  const onSubmit = (data) => {
    props.setPetName(data.pet_name);
    props.setStep(2);
  };
  return (
    <>
      <form id="my_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>Jméno mazlíčka</h1>
          <p>
            <input
              type="text"
              placeholder="Můj mazlíček"
              id="pet_name"
              name="pet_name"
              maxLength={18}
              defaultValue={props.petName}
              ref={register({
                required: true,
                maxLength: 20,
                pattern: /[A-Za-z0-9]/,
              })}
              onBlur={(e) => props.setPetName(e.target.value)}
            />
            {errors.pet_name && <div className="errorDiv">Povinný údaj</div>}
          </p>
        </div>
      </form>
    </>
  );
};
export default step1;
