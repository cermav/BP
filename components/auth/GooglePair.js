import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { withNotie } from "react-notie";

const GooglePair = (props) => {
  const [paired, setPaired] = useState(false);
  const clientId = process.env.googleAppId;
  // set state on load
  useEffect(() => {
    setPaired(props?.member?.google_account);
  }, [props.member]);

  const onSuccess = async (res) => {
    const LinkProfile = async (res) => {
      if (!paired) {
        const result = await fetch(process.env.apiURL + "auth/google-pair", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
          body: JSON.stringify(res),
        });
        const response = await result.json();
        if (result.status === 200) {
          setPaired(true);
          props.notie.success("Účet úspěšně spárován.");
        } else props.notie.warn(response?.message);
      }
    };
    LinkProfile(res);
  };

  const unlink = async () => {
    const result = await fetch(process.env.apiURL + "auth/google-unpair", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader(),
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      setPaired(false);
      props.notie.success("Spárování úspěšně odstraněno");
    } else props.notie.warn(response?.message);
  };
  const onFailure = (res) => {
    // notie?
    console.log(JSON.stringify(res));
  };

  return (
    <GoogleLogin
      render={(renderProps) => (
        <button
          onClick={paired ? unlink : renderProps.onClick}
          disabled={renderProps.disabled}
          type="button"
          id="google"
        >
          {paired ? "ODEBRAT ÚČET GOOGLE" : "PŘIDAT ÚČET GOOGLE"}
        </button>
      )}
      clientId={clientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy="single_host_origin"
    />
  );
};
export default withNotie(GooglePair);
