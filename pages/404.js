import React from "react";

/* Custom components */
import Head from "next/head";

const Contact = (props) => {
  return (
    <div className="errorPage">
      <Head>
        <title>Dr.Mouse - 404</title>
        <link rel="stylesheet" href="/index.css" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="page">
        <main>
          <div className="container mainContainer" style={{ textAlign: "center" }}>
            <a href="https://www.drmouse.cz" className="logo headerLogo">
              Dr.Mouse
            </a>
            <br />
            <br />
            <br />
            <h1>404 Stránka nenalezena </h1>
            <br />
            <p>Je nám líto, ale stránka, kterou hledáte, se u nás nenachází.</p>
            <p>
              Pokračujte prosím na{" "}
              <a href="https://www.drmouse.cz" style={{ textDecoration: "underline" }}>
                hlavní stránku
              </a>
              .
            </p>
          </div>
        </main>
      </div>
      <div id="modal-root"></div>
    </div>
  );
};
export default Contact;
