import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { GoogleLogin } from "react-google-login";

import { setToken } from "../../services/AuthToken";

import ToggleModalContent from "../modal/ToggleModalContent";
import GDPRForm from "../myProfile/GDPRForm";
import { withNotie } from "react-notie";

export const TOKEN_STORAGE_KEY = "GoogleToken";

export const setCookieToken = (token) => {
  Cookies.set(TOKEN_STORAGE_KEY, token);
};

const login = (props) => {
  const [GDPRConsent, setGDPRConsent] = useState(false);
  const [GoogleApiResponse, setGoogleApiResponse] = useState(null);

  const clientId = process.env.googleAppId;
  const buttonText = "PŘIHLÁSIT POMOCÍ GOOGLE ÚČTU";

  useEffect(() => {
    if (GDPRConsent && GoogleApiResponse) {
      onSuccess(GoogleApiResponse);
    }
  }, [GDPRConsent, GoogleApiResponse]);

  const onSuccess = async (res) => {
    setGoogleApiResponse(res);
    var gdpr = false;
    const gdprConsent = async (res) => {
      const response = await fetch(process.env.apiURL + "members/email/" + res.profileObj.email);
      const result = await response.json();
      // user does not exist or did not consent
      if (result === 0) {
        // změnit na volání togglu
        const button = document.getElementById("googleGDPR");
        button.click();
        return false;
        // show consent popup
      }
      // user exists and consented if he was asked to
      // if result == 1
      else return true;
    };
    if (!GDPRConsent) {
      gdpr = await gdprConsent(res);
    }
    const decodeToken = async (res) => {
      const response = await fetch(process.env.apiURL + "auth/google", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(res),
      });
      const decodedToken = await response.json();
      setCookieToken(res.access_token);
      decodedToken && setToken(decodedToken.access_token);
    };
    if (gdpr || GDPRConsent) decodeToken(res);
  };
  const onFailure = (res) => {
    props.notie.error("Něco se pokazilo, zkuste se přihlásit znovu.");
    console.log(JSON.stringify(res));
  };

  return (
    <>
      <GoogleLogin
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} type="button" id="google">
            {buttonText}
          </button>
        )}
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
      />
      <ToggleModalContent
        toggle={(show) => (
          <button type="button" id="googleGDPR" name="showGDPR" onClick={show} style={{ display: "none" }}></button>
        )}
        content={(hide) => <GDPRForm google hide={hide} setGDPRConsent={(response) => setGDPRConsent(response)} />}
      ></ToggleModalContent>
    </>
  );
};
export default withNotie(login);
