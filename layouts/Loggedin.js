import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { updateWidth, updateHeight } from "../redux/actions/window";

import Header from "./components/Header";
import Metas from "./components/Metas";
import Footer from "./components/Footer";

import { NotieProvider } from "react-notie";

import { initGA, logPageView } from "../helpers/analytics";

const isClient = typeof window === "object";
if (isClient && process.env.NODE_ENV === "production") {
  // console.log("Disabling console.");
  if (!window.console) window.console = {};
  var methods = ["log", "debug", "warn", "info"];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function () {};
  }
}

const Layout = (props) => {
  const isClient = typeof window === "object";
  const dispatch = useDispatch();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("488038288944000");
        ReactPixel.pageView();
      });
  }, []);

  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
    if (!isClient) {
      return false;
    }
    const handleResize = () => {
      dispatch(updateWidth(getSize().width));
      dispatch(updateHeight(getSize().height));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NotieProvider position="bottom">
      <div className={props.bodyClass}>
        <Metas />
        <Header isAuthorized={props.isAuthorized} isVet={props.isVet} />
        <div className="page">
          <div className="pageMain">
            <div className="fakeHero" />
            <main>
              <div className="container mainContainer">{props.children}</div>
            </main>
          </div>
          <Footer />
        </div>
        <div id="modal-root"></div>
      </div>
    </NotieProvider>
  );
};
Layout.propTypes = {
  checkCurrentDoctor: PropTypes.bool,
};

export default Layout;
