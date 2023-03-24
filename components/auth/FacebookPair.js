import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { withNotie } from "react-notie";

const FacebookPair = (props) => {
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    setPaired(props?.member?.facebook_account);
  }, [props.member]);
  const responseFacebook = async (res) => {
    const LinkProfile = async (res) => {
      if (paired) {
        const result = await fetch(process.env.apiURL + "auth/facebook-unpair", {
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
          setPaired(false);
          const response = await result.json();
          console.log(response);
          props.notie.success("Spárování úspěšně odstraněno");
        } else props.notie.warn(response?.message);
      }
      if (!paired) {
        const result = await fetch(process.env.apiURL + "auth/facebook-pair", {
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
          const response = await result.json();
          console.log(response);
          props.notie.success("Účet úspěšně spárován.");
        } else props.notie.warn(response?.message);
      }
    };
    LinkProfile(res);
  };

  return (
    <FacebookLogin
      appId={process.env.FacebookAppId}
      callback={responseFacebook}
      render={(renderProps) => (
        <button onClick={renderProps.onClick} id="facebook">
          {paired ? "ODEBRAT ÚČET FACEBOOK" : "PŘIDAT ÚČET FACEBOOK"}
        </button>
      )}
    />
  );
};
export default withNotie(FacebookPair);
