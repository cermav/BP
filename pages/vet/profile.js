import React, { useEffect, useState } from "react";
import unfetch from "isomorphic-unfetch";

import { withVetRoute } from "../../components/hoc/withVetRoute";
import { withRedux } from "../../components/hoc/withRedux";
import Layout from "../../layouts/Loggedin";
import Loader from "../../components/Loader";
import Tabs from "../../components/vetProfile/Tabs";
import BaseForm from "../../components/vetProfile/BaseForm";
import { getUserId } from "../../services/AuthToken";

const VetProfile = (notie) => {
  const [doctor, setDoctor] = useState(null);
  const [pending, setPending] = useState(true);

  const loadDoctor = async () => {
    setPending(true);
    // initialize doctor
    const response = await unfetch(`${process.env.apiURL}doctors/${getUserId()}`);
    const jsonResponse = await response.json();
    if (response.status === 200) {
      if (typeof window === "object" && window.localStorage)
        window.localStorage.setItem("last_pet", JSON.stringify(jsonResponse.data.last_pet));
      setDoctor(jsonResponse.data);
    } else {
      console.log("Nastala chyba při nahrávání");
    }
    setPending(false);
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  return (
    <Layout bodyClass="profile" checkCurrentDoctor={true}>
      <div className="profileWrapper">
        {pending ? (
          <Loader />
        ) : (
          <React.Fragment>
            <h1>Můj profil</h1>
            <Tabs activeTab={1} />
            <BaseForm doctor={doctor} />
          </React.Fragment>
        )}
      </div>
    </Layout>
  );
};

export default withRedux(withVetRoute(VetProfile));
