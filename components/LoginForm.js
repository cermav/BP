import React from "react";
import Link from "next/link";

/* Custom components */
import FormRow from "./form/FormRow";
import Label from "./form/Label";
import Input from "./form/Input";
import Submit from "./form/Submit";
import ErrorRowMsg from "./form/ErrorRowMsg";

/* Custom hooks */
import useForm from "../hooks/form";
import useLoginUser from "../hooks/loginUser";

const defInputs = {
    email: { value: "", error: "", required: true },
    password: { value: "", error: "", required: true }
};

const LoginForm = () => {
    const [{ loading, error }, setLoginData] = useLoginUser();

    const submitForm = () => {
        const loginJson = {};
        Object.entries(inputs).map(([name, input]) => (loginJson[name] = input.value));
        setLoginData(loginJson);
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(defInputs, submitForm);
    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {error !== "" && <ErrorRowMsg msg={error} />}
            <FormRow className={inputs.email.error && "errorRow"}>
                <Label value="Email:" htmlFor="vetEmail" />
                <Input id="vetEmail" name="email" type="email" required={defInputs.email.required} onChange={handleInputChange} />
                {inputs.email.error !== "" && <ErrorRowMsg msg={inputs.email.error} />}
            </FormRow>
            <FormRow className={inputs.password.error && "errorRow"}>
                <Label value="Heslo:" htmlFor="vetPassword" />
                <Input id="vetPassword" name="password" type="password" required={defInputs.password.required} onChange={handleInputChange} />
                {inputs.password.error !== "" && <ErrorRowMsg msg={inputs.password.error} />}
            </FormRow>
            <FormRow className="jcsb">
                <Submit name="login" id="vetLogin" value="Přihlásit se" onChange={handleSubmit} disabled={loading} />
                <Link href="/forgot-password" passHref>
                    <a className="forgottenPass">Zapomenuté heslo</a>
                </Link>
            </FormRow>
        </form>
    );
};
export default LoginForm;
