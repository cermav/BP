import { useState } from "react";
import validationScheme from "../helpers/validationScheme";

const useForm = (defaults = {}, callback) => {
    const [inputs, setInputs] = useState(defaults);

    const handleSubmit = event => {
        if (event) {
            event.preventDefault();
        }
        if (validateForm()) {
            callback();
        }
    };

    const handleInputChange = (event, callback) => {
        event.persist();
        const name = event.target.name;
        const value = event.target.type !== "checkbox" ? event.target.value : event.target.checked;
        /* fix validation error on the fly */
        let error = "";
        if (inputs[name].error !== "") {
            error = validateInput({ name, value, required: event.target.required });
        }
        setInputs(inputs => ({ ...inputs, [name]: { ...inputs[name], value, error } }));
    };

    const validateInput = input => {
        let error = "";
        if (input.required && input.value === "") {
            error = "Vyplňte prosím toto pole";
        }
        if (validationScheme[input.name] && !validationScheme[input.name].rule.test(input.value)) {
            error = validationScheme[input.name].error;
        }
        return error;
    };

    const validateForm = () => {
        let isValid = true;
        Object.keys(inputs).forEach(name => {
            const input = inputs[name];
            const error = validateInput({ name, value: input.value, required: input.required });
            if (error !== "") {
                isValid = false;
            }
            return setInputs(inputs => ({ ...inputs, [name]: { ...input, error } }));
        });
        return isValid;
    };

    const serverErrors = report => {
        if (report.errors !== undefined) {
            Object.keys(inputs).forEach(name => {
                if (name in report.errors) {
                    let error = "";
                    report.errors[name].map(message => {
                        error += message;
                    });
                    setInputs(inputs => ({ ...inputs, [name]: { ...inputs[name], error } }));
                }
            });
        } else {
            alert("Server error: " + report.message);
        }
    };

    return {
        handleSubmit,
        handleInputChange,
        inputs,
        serverErrors
    };
};
export default useForm;
