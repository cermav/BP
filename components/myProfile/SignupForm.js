import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withNotie } from "react-notie";

/* Custom components */
import FormRow from "../form/FormRow";
import Label from "../form/Label";
import Input from "../form/Input";
import Checkbox from "../form/Checkbox";
import Submit from "../form/Submit";
import ErrorRowMsg from "../form/ErrorRowMsg";
import ToggleModalContent from "../modal/ToggleModalContent";
import SignupModal from "./SignupModal";

/* Custom hooks */
import useForm from "../../hooks/form";
import useImageCrop from "../../hooks/cropImage";

const defInputs = {
  firstName: { value: "", error: "", required: true },
  lastName: { value: "", error: "", required: true },
  email: { value: "", error: "", required: true },
  password: { value: "", error: "", required: true },
  gdpr: { value: false, error: "" },
};

const SignupForm = (props) => {
  const [recaptchaSucceed, setRecaptchaSucceed] = useState(false);
  const [sent, setSent] = useState(false);
  const [registered, setRegistered] = useState(false);

  const onCaptchaChange = (value) => {
    setRecaptchaSucceed(value && value !== null);
  };

  const submitForm = () => {
    // disable button
    setSent(true);
    // collect data
    const registrationJson = { avatar: croppedImage };
    Object.entries(inputs).map(([name, input]) => (registrationJson[name] = input.value));
    /* send data to API */
    const fetchRegistration = async () => {
      try {
        const response = await fetch(process.env.apiURL + "members", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationJson),
        });
        const data = await response.json();
        setSent(false);
        if (response.status === 201) {
          // created
          setRegistered(true);
        } else {
          // data error
          serverErrors(data);
        }
      } catch (err) {
        props.notie.error("Nastala chyba při ukládání: " + err);
        console.log(err);
        // setError(err.toString());
      }
    };
    fetchRegistration();
  };
  const { inputs, handleInputChange, handleSubmit, serverErrors } = useForm(defInputs, submitForm);

  const saveProfilePicture = () => {
    onCropComplete();
  };
  const { crop, croppedImage, onImageLoaded, onCropChange, onCropComplete } = useImageCrop({
    defCrop: { unit: "%", width: 50, x: 25, aspect: 1 / 1 },
  });

  if (registered) {
    return (
      <div>
        <h2>Registrace proběhla úspěšně.</h2>
        <p>
          Děkujeme za Vaši registraci. Na Vámi zadanou emailovou adresu byl odeslán email s linkem pro ověření. Prosíme,
          pokračujte podle instrukcí v emailu.
        </p>
      </div>
    );
  } else {
    return (
      <div className="">
        <h2>Jsem pejskař a rád bych se zaregistroval...</h2>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <ToggleModalContent
            toggle={(show) => (
              <div
                className="profilePicture"
                onClick={show}
                style={
                  croppedImage !== null ? { backgroundImage: `url(${croppedImage})`, backgroundSize: "cover" } : {}
                }
              ></div>
            )}
            content={(hide) => (
              <SignupModal
                hide={hide}
                crop={crop}
                onImageLoaded={onImageLoaded}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                save={saveProfilePicture}
              />
            )}
          />
          <FormRow className={inputs.firstName.error && "errorRow"}>
            <Label value="Vaše jméno:" htmlFor="firstName" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required={defInputs.firstName.required}
              onChange={handleInputChange}
              autocomplete="false"
            />
            {inputs.firstName.error !== "" && <ErrorRowMsg msg={inputs.firstName.error} />}
            <Label value="Vaše příjmení:" htmlFor="lastName" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required={defInputs.lastName.required}
              onChange={handleInputChange}
              autocomplete="false"
            />
            {inputs.lastName.error !== "" && <ErrorRowMsg msg={inputs.name.error} />}
          </FormRow>
          <FormRow className={inputs.email.error && "errorRow"}>
            <Label value="Váš email:" htmlFor="myEmail" />
            <Input
              id="myEmail"
              name="email"
              type="email"
              required={defInputs.email.required}
              onChange={handleInputChange}
              autocomplete="false"
            />
            {inputs.email.error !== "" && <ErrorRowMsg msg={inputs.email.error} />}
          </FormRow>
          <FormRow className={inputs.password.error && "errorRow"}>
            <Label value="Heslo:" htmlFor="myPassword" />
            <Input
              id="myPassword"
              name="password"
              type="password"
              required={defInputs.password.required}
              onChange={handleInputChange}
              autocomplete="new-password"
            />
            {inputs.password.error !== "" && <ErrorRowMsg msg={inputs.password.error} />}
          </FormRow>
          <FormRow>
            <Checkbox
              name="gdpr"
              label="Souhlasím se zpracováním osobních údajů"
              id="myGdpr"
              onChange={handleInputChange}
            />
          </FormRow>
          <FormRow>
            <ReCAPTCHA sitekey="6LcWtb0UAAAAABLFFOjAAw3N7jOBOJVJIZRuTWuA" onChange={onCaptchaChange} />
          </FormRow>
          <FormRow>
            <Submit
              name="signup"
              id="mySignup"
              value="Registrovat"
              onChange={handleSubmit}
              disabled={!inputs.gdpr.value || !recaptchaSucceed || sent}
            />
          </FormRow>
        </form>
      </div>
    );
  }
};
export default withNotie(SignupForm);
