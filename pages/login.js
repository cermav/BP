import React, { useState } from "react";
import NewLoginForm from "../components/NewLoginForm";
import Layout from "../layouts/Loggedout";
import Link from "../components/ActiveLink";
import GoogleLogin from "../components/auth/GoogleLogin";
import FacebookLogin from "../components/auth/FacebookLogin";
import AppleIDLogin from "../components/auth/AppleIDLogin";

import { withProfileRedirect } from "../components/hoc/withProfileRedirect";

import { withRedux } from "../components/hoc/withRedux";

const Login = () => {
  const [Login, setLogin] = useState("");
  return (
    <Layout bodyClass="new profile" registrationPromo={false}>
      <div className="text-document" style={{ margin: "0 auto" }}>
        <h2>Přihlášení uživatele</h2>
        <br />
        <div className="loginButtons" style={Login === "" ? { display: "flex" } : { display: "none" }}>
          <button type="button" onClick={() => setLogin("mail")} id="mail">
            PŘIHLÁSIT
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              margin: "1rem",
              gap: "1rem",
            }}
          >
            Ještě u nás nemáte účet?
            {/*
              <Link activeClassName="active" href={`/vet/signup`}>
                <a href={`/vet/signup`}>REGISTRACE VETERINÁŘE</a>
              </Link>*/}
            <Link activeClassName="active" href={`/moje-zver/signup`}>
              <a href={`/moje-zver/signup`}>REGISTRACE PÁNÍČKA</a>
            </Link>
          </div>
        </div>
        {Login === "mail" && <NewLoginForm Login={Login} setLogin={setLogin} />}
      </div>
    </Layout>
  );
};
export default withRedux(withProfileRedirect(Login));
