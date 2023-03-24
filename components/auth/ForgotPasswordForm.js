import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/* Custom components */
import FormRow from "../form/FormRow";
import Label from "../form/Label";
import Input from "../form/Input";
import Submit from "../form/Submit";
import ErrorRowMsg from "../form/ErrorRowMsg";

/* Custom hooks */
import useForm from "../../hooks/form";
import { withNotie } from "react-notie";

const defInputs = {
  email: { value: "", error: "", required: true },
};

const ForgotPasswordForm = (props) => {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const submitForm = async () => {
    const resetJson = {};
    Object.entries(inputs).map(([name, input]) => (resetJson[name] = input.value));

    try {
      const response = await fetch(process.env.apiURL + "auth/forgot-password", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetJson),
      });
      const data = await response.json();

      if (response.status === 201) {
        // created
        console.log(inputs);
        props.notie.success("Link pro reset hesla byl odeslán.");
        setSent(true);
        // TODO: reset form
        //inputs["email"].value = "";
      } else {
        // data error
        props.notie.error("Nastala chyba při odeslání linku.");
      }
    } catch (err) {
      props.notie.error("Došlo k neočekávané chybě, prosím zkuste to později.");
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(defInputs, submitForm);

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <FormRow className={inputs.email.error && "errorRow"}>
        {sent ? (
          <>
            <Label value="Odesláno." htmlFor="vetEmail" />
            <Label value={`Odkaz pro obnovení hesla byl odeslán na email ${inputs?.email?.value}`} />
          </>
        ) : (
          <>
            <Label value="Email:" htmlFor="vetEmail"></Label>
            <Input
              id="vetEmail"
              name="email"
              type="email"
              required={defInputs.email.required}
              onChange={handleInputChange}
            />
          </>
        )}

        {inputs.email.error !== "" && <ErrorRowMsg msg={inputs.email.error} />}
      </FormRow>
      <FormRow>
        {sent ? (
          <button
            className={`formSubmit button`}
            id="vetLogin"
            name="login"
            type="button"
            required={defInputs.email.required}
            onClick={() => router.push("/login")}
          >
            Zpět na přihlášení
          </button>
        ) : (
          <Submit name="login" id="vetLogin" value="Odeslat link pro reset hesla" onChange={handleSubmit} />
        )}
      </FormRow>
      {!sent && (
        <Link href="/login">
          <a>Zpět na přihlášení</a>
        </Link>
      )}
    </form>
  );
};
export default withNotie(ForgotPasswordForm);
