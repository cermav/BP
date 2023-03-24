import React, { useState, useEffect } from "react";
import Router, { withRouter } from "next/router";
import { withNotie } from 'react-notie'

import Link from "next/link";

/* Custom components */
import FormRow from "../form/FormRow";
import Label from "../form/Label";
import Input from "../form/Input";
import Submit from "../form/Submit";
import ErrorRowMsg from "../form/ErrorRowMsg";

/* Custom hooks */
import useForm from "../../hooks/form";

const ResetPasswordForm = ({ router, notie }) => {


    const [remoteLink, setRemoteLink] = useState("");
    const defInputs = {
        password: { value: "", error: "", required: true },
        password_confirmation: { value: "", error: "", required: true }
    };

    useEffect(() => {
        if (router.query.link != null) {
            setRemoteLink(atob(router.query.link));
        } else {
            notie.error("Chybné vstupní parametry");
        }
    }, []);


    const submitForm = async () => {
        const resetJson = {};
        Object.entries(inputs).map(([name, input]) => (resetJson[name] = input.value));

        try {
            const response = await fetch(remoteLink, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(resetJson)
            });
            const responseJson = await response.json();
            if (response.status === 200) {
                notie.success("Heslo bylo změněno.");
                Router.push("/login");
            } else {
                notie.error("Heslo se nepodařilo změnit. " + (responseJson.message !== 'undefiend' ? responseJson.message : responseJson));
            }
        } catch (err) {
            notie.error("Cyhba: " + err);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(defInputs, submitForm);

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <FormRow className={inputs.password.error && "errorRow"}>
                <Label value="Nové heslo:" htmlFor="password" />
                <Input id="password" name="password" type="password" required={defInputs.password.required} onChange={handleInputChange} />
                {inputs.password.error !== "" && <ErrorRowMsg msg={inputs.password.error} />}
            </FormRow>
            <FormRow className={inputs.password_confirmation.error && "errorRow"}>
                <Label value="Znovu heslo:" htmlFor="password_confirmation" />
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required={defInputs.password_confirmation.required}
                    onChange={handleInputChange}
                />
                {inputs.password_confirmation.error !== "" && <ErrorRowMsg msg={inputs.password_confirmation.error} />}
            </FormRow>
            <FormRow>
                <Submit name="changePswd" id="changePswd" value="Změnit heslo" onChange={handleSubmit} />
            </FormRow>
            <Link href="/login">
                <a>Zpět na přihlášení</a>
            </Link>
        </form>
    )
}
export default withNotie(withRouter(ResetPasswordForm));