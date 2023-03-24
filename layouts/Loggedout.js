import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "./components/Header";
import Metas from "./components/Metas";
import Hero from "./components/Hero";
import HeroHTML from "./components/HeroHTML";
import Footer from "./components/Footer";
import RegistrationPromo from "./components/RegistrationPromoVets";
import EmptyPromo from "./components/EmptyPromo";
import { NotieProvider } from "react-notie";

import { updateWidth, updateHeight } from "../redux/actions/window";

import ReactDOMServer from "react-dom/server";
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
  //    props.notie.success("Chcete cookie?");
  const isClient = typeof window === "object";
  const dispatch = useDispatch();
  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };
  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("488038288944000");
        ReactPixel.pageView();
      });
  }, []);
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
  const convertJSXtoHTML = (heroHTML) => {
    let justHTML = ReactDOMServer.renderToStaticMarkup(heroHTML);
    return justHTML;
  };
  return (
    <NotieProvider position="bottom">
      <div className={props.bodyClass}>
        <Metas />
        <Header />
        <div className="page">
          <div className="pageMain">
            {props.heroHTML !== false && <HeroHTML heroHTML={convertJSXtoHTML(props.heroHTML)} />}
            {props.heroHTML === false && props.hero !== false && <Hero hero={props.hero} />}
            {props.heroHTML === false && props.hero === false && <div className="fakeHero" />}
            <main>
              <div className="container mainContainer">{props.children}</div>
            </main>
            {props.registrationPromo !== false && <RegistrationPromo />}
            {props.registrationPromo === false && <EmptyPromo />}
          </div>
          <Footer />
        </div>
        <div id="modal-root"></div>
      </div>
    </NotieProvider>
  );
};

Layout.defaultProps = {
  hero: false,
  heroHTML: false,
  registrationPromo: true,
  button: false,
  buttonURL: false,
};

export default Layout;
