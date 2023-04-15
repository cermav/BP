import React, { useEffect, useState } from "react";
import { withNotie } from "react-notie";
import Router from "next/router";
import PropTypes from "prop-types";
import unfetch from "isomorphic-unfetch";
import { isVet, isAdmin, getAuthorizationHeader } from "../../services/AuthToken";

/* Custom components */
import FormRow from "../form/FormRow";
import Label from "../form/Label";
import Input from "../form/Input";
import Textarea from "../form/TextArea";
import Checkbox from "../form/Checkbox";
import Submit from "../form/Submit";
import ErrorRowMsg from "../form/ErrorRowMsg";
import ToggleModalContent from "../modal/ToggleModalContent";

/* Custom hooks */
import useForm from "../../hooks/form";
import useImageCrop from "../../hooks/cropImage";
import PasswordForm from "./PasswordForm";

import GooglePair from "../auth/GooglePair";
import FacebookPair from "../auth/FacebookPair";

const addressFields = ["street", "city", "post_code", "phone", "second_phone", "website"];
const staffFields = ["doctors_count", "nurses_count", "others_count", "doctors_names"];

const BaseForm = ({ doctor, notie }) => {
  console.log(doctor);

  const [pending, setPending] = useState(false);
  const stateToPublish = [1, 2, 4, 6];

  const defInputs = {
    name: { value: doctor != null ? doctor.name : "", error: "", required: true },
    slug: { value: doctor != null ? doctor.slug : "", error: "", required: false },
    email: { value: doctor != null ? doctor.email : "", error: "", required: true },
    street: { value: doctor != null ? doctor.address.street : "", error: "", required: true },
    post_code: { value: doctor != null ? doctor.address.post_code : "", error: "", required: true },
    city: { value: doctor != null ? doctor.address.city : "", error: "", required: true },
    phone: { value: doctor != null ? doctor.address.phone : "", error: "", required: true },
    second_phone: { value: doctor != null ? doctor.address.second_phone : "", error: "", required: false },
    website: { value: doctor != null ? doctor.address.website : "", error: "", required: false },
    description: { value: doctor != null ? doctor.description : "", error: "", required: false },
    doctors_count: { value: doctor != null ? doctor.staff_info.doctors_count : "", error: "", required: false },
    nurses_count: { value: doctor != null ? doctor.staff_info.nurses_count : "", error: "", required: false },
    others_count: { value: doctor != null ? doctor.staff_info.others_count : "", error: "", required: false },
    doctors_names: { value: doctor != null ? doctor.staff_info.doctors_names : "", error: "", required: false },
    speaks_english: { value: doctor != null ? doctor.speaks_english : "", error: "", required: false },
  };

  const submitForm = async () => {
    setPending(true);
    const vetJson = {
      avatar: croppedImage,
      address: {},
      staff_info: {},
    };

    Object.entries(inputs).forEach(([name, input]) => {
      if (addressFields.includes(name)) {
        vetJson.address[name] = input.value;
        return;
      }
      if (staffFields.includes(name)) {
        vetJson.staff_info[name] = input.value;
        return;
      }
      vetJson[name] = input.value;
    });

    /* send data to API */
    try {
      const response = await unfetch(process.env.apiURL + "doctors/" + doctor.id, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify(vetJson),
      });
      const data = await response.json();

      if (response.status === 200) {
        // updated
        notie.success("Data byla aktualizována");
        setPending(false);
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
      const response = await fetch(process.env.apiURL + "admin/doctors/" + doctor.id, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        Router.push("/admin/vets");
        notie.success("Záznam byl odstraněn");
      } else {
        notie.error("Záznam se nepodařilo odstranit.");
      }
    } catch (err) {
      notie.error("Nastala chyba při mazání: " + err);
    }
  };

  const publishProfile = async () => {
    try {
      const response = await fetch(process.env.apiURL + "admin/doctors/" + doctor.id, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify({ status: 3 }),
      });
      const data = await response.json();
      if (response.status === 200) {
        notie.success("Záznam byl publikován");
      } else {
        notie.error("Záznam se nepodařilo publikovat.");
      }
    } catch (err) {
      notie.error("Nastala chyba při publikování: " + err);
    }
  };

  const styleSpaceLeft = { marginLeft: "16px" };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <FormRow className={inputs.name.error && "errorRow"}>
          <Label value="Vaše jméno a příjmení (název kliniky):" htmlFor="vetName" />
          <Input
            id="vetName"
            name="name"
            type="text"
            value={inputs.name.value}
            required={inputs.name.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.name.error !== "" && <ErrorRowMsg msg={inputs.name.error} />}
        </FormRow>
        <FormRow className={inputs.slug.error && "errorRow"}>
          <Label value="Slug (url):" htmlFor="vetSlug" />
          <Input
            id="vetSlug"
            name="slug"
            type="text"
            value={inputs.slug.value}
            required={inputs.slug.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.slug.error !== "" && <ErrorRowMsg msg={inputs.slug.error} />}
        </FormRow>
        <FormRow className={inputs.email.error && "errorRow"}>
          <Label value="Váš email:" htmlFor="vetEmail" />
          <Input
            id="vetEmail"
            name="email"
            type="email"
            value={inputs.email.value}
            required={inputs.email.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.email.error !== "" && <ErrorRowMsg msg={inputs.email.error} />}
        </FormRow>
        <FormRow className={inputs.street.error && "errorRow"}>
          <Label value="Ulice a číslo popisné:" htmlFor="vetStreet" />
          <Input
            id="vetStreet"
            name="street"
            type="text"
            value={inputs.street.value}
            required={inputs.street.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.street.error !== "" && <ErrorRowMsg msg={inputs.street.error} />}
        </FormRow>
        <FormRow className={inputs.post_code.error && "errorRow"}>
          <Label value="PSČ:" htmlFor="vetPostCode" />
          <Input
            id="vetPostCode"
            name="post_code"
            type="text"
            value={inputs.post_code.value}
            required={inputs.post_code.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.post_code.error !== "" && <ErrorRowMsg msg={inputs.post_code.error} />}
        </FormRow>
        <FormRow className={inputs.city.error && "errorRow"}>
          <Label value="Město:" htmlFor="vetCity" />
          <Input
            id="vetCity"
            name="city"
            type="text"
            value={inputs.city.value}
            required={inputs.city.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.city.error !== "" && <ErrorRowMsg msg={inputs.city.error} />}
        </FormRow>
        <FormRow className={inputs.phone.error && "errorRow"}>
          <Label value="Telefonní číslo:" htmlFor="vetPhone" />
          <Input
            id="vetPhone"
            name="phone"
            type="text"
            value={inputs.phone.value}
            required={inputs.phone.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.phone.error !== "" && <ErrorRowMsg msg={inputs.phone.error} />}
        </FormRow>
        <FormRow className={inputs.second_phone.error && "errorRow"}>
          <Label value="Druhé telefonní číslo:" htmlFor="vetSecondPhone" />
          <Input
            id="vetSecondPhone"
            name="second_phone"
            value={inputs.second_phone.value}
            type="text"
            required={inputs.second_phone.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.second_phone.error !== "" && <ErrorRowMsg msg={inputs.second_phone.error} />}
        </FormRow>
        <FormRow className={inputs.website.error && "errorRow"}>
          <Label value="Web:" htmlFor="vetWebsite" />
          <Input
            id="vetWebsite"
            name="website"
            type="text"
            value={inputs.website.value}
            required={inputs.website.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.website.error !== "" && <ErrorRowMsg msg={inputs.website.error} />}
        </FormRow>
        <FormRow className={inputs.description.error && "errorRow"}>
          <Label value="Zde můžete několika větami popsat vaši praxi / kliniku:" htmlFor="vetDescription" />
          <Textarea
            id="vetDescription"
            name="description"
            value={inputs.description.value}
            rows={4}
            required={inputs.description.required}
            onChange={handleInputChange}
          />
          {inputs.description.error !== "" && <ErrorRowMsg msg={inputs.description.error} />}
        </FormRow>
        <FormRow className={inputs.doctors_count.error && "errorRow"}>
          <Label value="Počet doktorů:" htmlFor="vetDoctorsCount" />
          <Input
            id="vetDoctorsCount"
            name="doctors_count"
            value={inputs.doctors_count.value}
            type="name"
            required={inputs.doctors_count.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.doctors_count.error !== "" && <ErrorRowMsg msg={inputs.doctors_count.error} />}
        </FormRow>
        <FormRow className={inputs.nurses_count.error && "errorRow"}>
          <Label value="Počet sester:" htmlFor="vetNursesCount" />
          <Input
            id="vetNursesCount"
            name="nurses_count"
            value={inputs.nurses_count.value}
            type="name"
            required={inputs.nurses_count.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.nurses_count.error !== "" && <ErrorRowMsg msg={inputs.nurses_count.error} />}
        </FormRow>
        <FormRow className={inputs.others_count.error && "errorRow"}>
          <Label value="Počet ostatní:" htmlFor="vetOthersCount" />
          <Input
            id="vetOthersCount"
            name="others_count"
            value={inputs.others_count.value}
            type="name"
            required={inputs.others_count.required}
            onChange={handleInputChange}
            autocomplete="false"
          />
          {inputs.others_count.error !== "" && <ErrorRowMsg msg={inputs.others_count.error} />}
        </FormRow>
        <FormRow className={inputs.doctors_names.error && "errorRow"}>
          <Label value="Jména doktorů:" htmlFor="vetDoctorsNames" />
          <Textarea
            id="vetDoctorsNames"
            name="doctors_names"
            value={inputs.doctors_names.value}
            rows={4}
            required={inputs.doctors_names.required}
            onChange={handleInputChange}
          />
          {inputs.doctors_names.error !== "" && <ErrorRowMsg msg={inputs.doctors_names.error} />}
        </FormRow>
        <FormRow>
          <Checkbox
            name="speaks_english"
            label="Mluvíme anglicky"
            id="vetEnglish"
            checked={inputs.speaks_english.value}
            onChange={handleInputChange}
          />
        </FormRow>
        <FormRow>
          <Submit name="save" id="vetChange" value="Uložit" onChange={handleSubmit} />
          {isAdmin() && (
            <React.Fragment>
              <button type="button" onClick={removeProfile} className="button red" style={styleSpaceLeft}>
                Odstranit
              </button>
              {stateToPublish.includes(doctor.state_id) && (
                <button type="button" onClick={publishProfile} className="button green" style={styleSpaceLeft}>
                  Publikovat
                </button>
              )}
            </React.Fragment>
          )}
        </FormRow>
      </form>

      {isVet() && <PasswordForm />}
    </>
  );
};

BaseForm.propTypes = {
  doctor: PropTypes.object.isRequired,
};
export default withNotie(BaseForm);
