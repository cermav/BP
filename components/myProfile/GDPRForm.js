import React from "react";
import { withNotie } from "react-notie";
import Link from "next/link";

/* Custom components */
import FormRow from "../form/FormRow";
import Checkbox from "../form/Checkbox";
import Submit from "../form/Submit";

import TransparentModal from "../modal/TransparentModal";
/* Custom hooks */
import useForm from "../../hooks/form";

const defInputs = {
  gdpr: { value: false, error: "", required: true },
};

const SignupForm = (props) => {
  const submitForm = () => {
    if (props.facebook) props.setGDPRConsent("facebook");
    if (props.google) props.setGDPRConsent("google");
    props.hide();
    //Cookies.set(GDPR_CONSENT, true);
  };
  const { inputs, handleInputChange, handleSubmit } = useForm(defInputs, submitForm);

  return (
    <TransparentModal passClass={["modalBlack gdpr"]} title="Souhlas s registrací" hide={props.hide}>
      <div className="container">
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormRow>
            Pro vytvoření uživatelského profilu potřebujeme Váš souhlas se zpracováním osobních údajů.{" "}
            {/*  We use cookies to understand how you use our site and to improve your experience. By continuing to use our site, you accept our */}
            {/*                         <a href="https://policies.google.com/technologies/cookies?hl=cs">Více o cookies</a> a{" "}
                        <a href="https://policies.google.com/privacy?hl=cs">zásady ochrany osobních údajů</a>.{" "} */}
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
            <Link href="/privacy-policy">
              <>
                <a href="/privacy-policy">Zásady ochrany osobních údajů</a>
              </>
            </Link>
          </FormRow>
          <FormRow className="gdpr">
            <button
              type="button"
              className="formSubmit button"
              name="signup"
              id="mySignup"
              value="Zrušit"
              onClick={props.hide}
            >
              Zrušit
            </button>
            <Submit
              name="signup"
              id="mySignup"
              value="Pokračovat"
              onClick={handleSubmit}
              disabled={!inputs.gdpr.value}
            />
          </FormRow>
        </form>
      </div>
    </TransparentModal>
  );
};
export default withNotie(SignupForm);
