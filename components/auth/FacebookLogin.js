import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { setToken } from "../../services/AuthToken";
import ToggleModalContent from "../modal/ToggleModalContent";
import GDPRForm from "../myProfile/GDPRForm";
import { withNotie } from "react-notie";

export const TOKEN_STORAGE_KEY = "FacebookToken";
export const FACEBOOK_USER_ID = "FBUserID";

export const setCookieToken = (token) => {
  Cookies.set(TOKEN_STORAGE_KEY, token);
};
export const setUserID = (id) => {
  Cookies.set(FACEBOOK_USER_ID, id);
};
const Login = (props) => {
  const [GDPRConsent, setGDPRConsent] = useState(false);
  const [FacebookApiResponse, setFacebookApiResponse] = useState(null);

  useEffect(() => {
    if (GDPRConsent && FacebookApiResponse) {
      responseFacebook(FacebookApiResponse);
    }
  }, [GDPRConsent, FacebookApiResponse]);

  // TODO on Failure
  const responseFacebook = async (res) => {
    console.log("responseFacebook");
    setFacebookApiResponse(res);
    var gdpr = false;
    const gdprConsent = async (res) => {
      const response = await fetch(process.env.apiURL + "members/email/" + res.email);
      const result = await response.json();
      // user does not exist or did not consent
      if (result === 0) {
        const button = document.getElementById("facebookGDPR");
        button.click();
        return false;
        // show consent popup
      }
      // user exists and consented if he was asked to
      else return true;
    };
    if (!GDPRConsent) {
      gdpr = await gdprConsent(res);
    }
    const decodeToken = async (res) => {
      const result = await fetch(process.env.apiURL + "auth/facebook", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(res),
      });
      const response = await result.json();
      if (result.status === 200) {
        setCookieToken(res.accessToken);
        setUserID(res.userID);
        setToken(response.access_token);
      } else props.notie.error("něco se nepovedlo.");
    };
    if (res?.status === "unknown") return props.notie.error("Nyní se nelze přihlásit přes Facebook.");
    if (gdpr || GDPRConsent) decodeToken(res);
  };

  return (
    <>
      <FacebookLogin
        appId={process.env.FacebookAppId}
        fields="name, email"
        callback={responseFacebook}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} id="facebook">
            PŘIHLÁSIT POMOCÍ FACEBOOKU
          </button>
        )}
      />
      <ToggleModalContent
        toggle={(show) => (
          <button type="button" id="facebookGDPR" name="showGDPR" onClick={show} style={{ display: "none" }}></button>
        )}
        content={(hide) => <GDPRForm facebook hide={hide} setGDPRConsent={(response) => setGDPRConsent(response)} />}
      ></ToggleModalContent>
    </>
  );
};
export default withNotie(Login);
