import React from 'react';
import { withNotie } from 'react-notie'

/* Custom components */
import FormRow from '../form/FormRow';
import Label from '../form/Label';
import Input from '../form/Input';
import Submit from '../form/Submit';
import ErrorRowMsg from '../form/ErrorRowMsg';

import { getUserId, getAuthorizationHeader } from '../../services/AuthToken';

/* Custom hooks */
import useForm from '../../hooks/form';

const defInputs = {
    current_password: { value: "", error: "", required: true },
    password: { value: "", error: "", required: true },
    password_confirmation: { value: "", error: "", required: true }
}

const PasswordForm = ({ notie }) => {

    const submitForm = async () => {
        const passwordJson = {};
        Object.entries(inputs).map(([name, input]) => passwordJson[name] = input.value);

        try {
            const response = await fetch(process.env.apiURL + 'auth/change-password/' + getUserId(), {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationHeader()
                },
                body: JSON.stringify(passwordJson)
            });
            const data = await response.json();

            if (response.status === 200) { // updated                    
                notie.success(data)
                // reset form
                document.getElementById("change-password-form").reset();
            } else {
                // data error
                serverErrors(data)
            }
        }
        catch (err) {
            notie.error(err);
        }
    }
    const { inputs, handleInputChange, handleSubmit, serverErrors } = useForm(defInputs, submitForm);
    return (
        <form id="change-password-form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <FormRow className={inputs.current_password.error && "errorRow"}>
                <Label value="Staré heslo:" htmlFor="current_password" />
                <Input id="current_password" name="current_password" type="password" required={defInputs.current_password.required} onChange={handleInputChange} />
                {inputs.current_password.error !== "" && <ErrorRowMsg msg={inputs.current_password.error} />}
            </FormRow>
            <FormRow className={inputs.password.error && "errorRow"}>
                <Label value="Nové heslo:" htmlFor="password" />
                <Input id="password" name="password" type="password" required={defInputs.password.required} onChange={handleInputChange} />
                {inputs.password.error !== "" && <ErrorRowMsg msg={inputs.password.error} />}
            </FormRow>
            <FormRow className={inputs.password_confirmation.error && "errorRow"}>
                <Label value="Znovu heslo:" htmlFor="password_confirmation" />
                <Input id="password_confirmation" name="password_confirmation" type="password" required={defInputs.password_confirmation.required} onChange={handleInputChange} />
                {inputs.password_confirmation.error !== "" && <ErrorRowMsg msg={inputs.password_confirmation.error} />}
            </FormRow>
            <FormRow>
                <Submit name="changePswd" id="changePswd" value="Změnit heslo" onChange={handleSubmit} />
            </FormRow>
        </form>
    )
}
export default withNotie(PasswordForm);