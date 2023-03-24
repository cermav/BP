//import React, { useEffect } from "react";
import React from "react";
//import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

//import dynamic from "next/dynamic";
//import NoSSR from "react-no-ssr";

/* Custom data */

/* Custom components */
import Layout from "../layouts/Loggedout";
import Loader from "../components/Loader.js";

import { withRedux } from "../components/hoc/withRedux";

//import { fetchProperties } from "../redux/actions/properties";

//Leaflet Maps - fix, load map on frontend only
//let Map = dynamic(() => import("../components/map/Map"), { ssr: false });
// import Map from "../components/map/Map";

const Index = (props) => {
  return (
    <Layout
      bodyClass="home"
      heroHTML={
        <div>
          <h1 className="lg">Snadná cesta k&nbsp;veterináři</h1>
          <p>
            Pod záložkou Moje zvěř najdete promo, po přihlášení je možné sekci moje zvěř používat.
            <br />
            user: test
            <br />
            heslo: test
          </p>
        </div>
      }
    ></Layout>
  );
};

export default withRedux(Index);
