import React, { useState } from "react";
import { withNotie } from "react-notie";
import Router from "next/router";
import PropTypes from "prop-types";
import unfetch from "isomorphic-unfetch";
import { isAdmin, getAuthorizationHeader } from "../../services/AuthToken";
import { useDispatch } from "react-redux";
import { userUpdateAvatar } from "../../redux/actions/user";

/* Custom components */
import FormRow from "../form/FormRow";
import Label from "../form/Label";
import Input from "../form/Input";
import Submit from "../form/Submit";
import ErrorRowMsg from "../form/ErrorRowMsg";
import ToggleModalContent from "../modal/ToggleModalContent";
//import VetSignupModal from "../VetSignupModal";

import GooglePair from "../auth/GooglePair";
import FacebookPair from "../auth/FacebookPair";

/* Custom hooks */
import useForm from "../../hooks/form";
import useImageCrop from "../../hooks/cropImage";
import PasswordForm from "./PasswordForm";

const BaseForm = ({ member, notie }) => {
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);

  console.log(member);

  const defInputs = {
    name: { value: member != null ? member.name : "", error: "", required: true },
    firstName: { value: member != null ? member.firstName : "", error: "", required: true },
    lastName: { value: member != null ? member.lastName : "", error: "", required: true },
    email: { value: member != null ? member.email : "", error: "", required: true },
  };

  const submitForm = async () => {
    setPending(true);
    const memberJson = {
      avatar: croppedImage,
    };

    Object.entries(inputs).forEach(([name, input]) => {
      memberJson[name] = input.value;
    });

    /* send data to API */
    try {
      const response = await unfetch(process.env.apiURL + "members/" + member.id, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify(memberJson),
      });
      const data = await response.json();

      if (response.status === 200) {
        dispatch(userUpdateAvatar(Math.random()));
        // updated
        notie.success("Data byla aktualizována");
      } else {
        serverErrors(data);
      }
    } catch (err) {
      notie.error("Nastala chyba při ukládání: " + err);
    }
    setPending(false);
  };

  const { inputs, handleInputChange, handleSubmit, serverErrors } = useForm(defInputs, submitForm);

  const saveProfilePicture = () => {
    onCropComplete();
  };
  const { crop, croppedImage, onImageLoaded, onCropChange, onCropComplete } = useImageCrop({
    defCrop: { unit: "%", width: 50, x: 25, aspect: 1 / 1 },
  });

  const removeProfile = async () => {
    try {
      const response = await fetch(process.env.apiURL + "members/" + member.id, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      await response.json();
      if (response.status === 200) {
        Router.push("/admin/users");
      } else {
        notie.error("Záznam se nepodařilo odstranit.");
      }
    } catch (err) {
      notie.error("Nastala chyba při ukládání: " + err);
    }
  };

  const styleSpaceLeft = { marginLeft: "16px" };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        {/*
        <ToggleModalContent
          toggle={(show) => (
            <div
              className="profilePicture"
              onClick={show}
              style={
                croppedImage !== null
                  ? { backgroundImage: `url(${croppedImage})` }
                  : {
                      backgroundImage: `url(${
                        member != null ? process.env.storageUrl + "/member/" + member.avatar : ""
                      })`,
                    }
              }
            ></div>
          )}
          content={(hide) => (
            <VetSignupModal
              hide={hide}
              crop={crop}
              onImageLoaded={onImageLoaded}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              save={saveProfilePicture}
            />
          )}
        />*/}

        <FormRow className={inputs.name.error && "errorRow"}>
          <Label value="Vaše jméno:" htmlFor="firstName" />
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={inputs.firstName.value}
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
            value={inputs.lastName.value}
            required={defInputs.lastName.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.lastName.error !== "" && <ErrorRowMsg msg={inputs.lastName.error} />}
        </FormRow>
        <FormRow className={inputs.email.error && "errorRow"}>
          <Label value="Váš email:" htmlFor="myEmail" />
          <Input
            id="myEmail"
            name="email"
            type="email"
            value={inputs.email.value}
            required={defInputs.email.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.email.error !== "" && <ErrorRowMsg msg={inputs.email.error} />}
        </FormRow>
        <FormRow>
          <Submit name="save" id="vetChange" value="Uložit" onChange={handleSubmit} />
          {isAdmin() && (
            <button onClick={removeProfile} className="button red" style={styleSpaceLeft}>
              Odstranit
            </button>
          )}
        </FormRow>
      </form>

      {/*
        <div className="loginButtons loggedIn">
        <GooglePair member={member}></GooglePair>
        <FacebookPair member={member}></FacebookPair>
      </div>
        */}

      <PasswordForm />
    </>
  );
};

BaseForm.propTypes = {
  member: PropTypes.object.isRequired,
};
export default withNotie(BaseForm);
