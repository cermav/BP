import React, { useEffect, useState } from "react";
import unfetch from "isomorphic-unfetch";

import { withUserRoute } from "../components/hoc/withUserRoute";
import { withRedux } from "../components/hoc/withRedux";
import Layout from "../layouts/Loggedin";
import Loader from "../components/Loader";
import BaseForm from "../components/myProfile/BaseForm";
import { getUserId, getAuthorizationHeader } from "../services/AuthToken";

const VetProfile = (notie) => {
  const [member, setMember] = useState(null);
  const [pending, setPending] = useState(true);

  const loadMember = async () => {
    setPending(true);
    // initialize meber
    const response = await unfetch(`${process.env.apiURL}members/${getUserId()}`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader(),
      },
    });
    const jsonResponse = await response.json();
    if (response.status === 200) {
      setMember(jsonResponse.data);
      if (typeof window === "object" && window.localStorage)
        window.localStorage.setItem("last_pet", JSON.stringify(jsonResponse?.data?.last_pet));
    } else {
      console.log("Nastala chyba při nahrávání");
    }
  };

  useEffect(() => {
    loadMember();
  }, []);
  useEffect(() => {
    if (member !== null) {
      setPending(false);
    }
  }, [member]);

  return (
    <Layout bodyClass="profile" checkCurrentDoctor={true}>
      <div className="profileWrapper">
        {pending ? (
          <Loader />
        ) : (
          <React.Fragment>
            <h1>Můj profil</h1>
            <BaseForm member={member} />
          </React.Fragment>
        )}
      </div>
    </Layout>
  );
};

export default withUserRoute(withRedux(VetProfile));
