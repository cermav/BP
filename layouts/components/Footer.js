import React, { useState, useEffect } from "react";
import Link from "next/link";
/* Custom hooks */
import { withNotie } from "react-notie";

const Footer = (props) => {
  const getYear = () => {
    let year = new Date();
    return year.getFullYear();
  };
  const [emailInput, setEmailInput] = useState("@");
  const [cookiesApproved, setcookiesApproved] = useState(true);

  const approveCookie = () => {
    localStorage.setItem("cookiesApproved", Date.now());
    setcookiesApproved(true);
  };
  useEffect(() => {
    const cockiesOK = localStorage.getItem("cookiesApproved");
    setcookiesApproved(cockiesOK);
  });

  const handleEmailSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      const response = await fetch(process.env.apiURL + "newsletter", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await response.json();

      if (response.status === 201) {
        // created
        props.notie.success("Váš email byl uložen. Děkujeme za váš zájem.");
        setEmailInput("");
      } else {
        // data error
        props.notie.error("Nastala chyba při odeslání linku. Nejste již přihlášen?");
      }
    } catch (err) {
      props.notie.error("Došlo k neočekávané vyjímce, prosím zkuste to později.");
    }
  };
  const handleEmailChange = (event, callback) => {
    event.persist();
    setEmailInput(event.target.value);
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footerInner">
          <div className="left">
            <Link href="/">
              <a className="logo headerLogo">Dr.Mouse</a>
            </Link>
            <nav className="menu">
              <ul>
              </ul>
            </nav>
            <div className="socialBlock">
              <a
                href="https://www.facebook.com/drmousecz"
                rel="noreferrer"
                target="_blank"
                className="icon social facebook"
                title="Dr.Mouse na facebooku"
              ></a>
              <a
                href="https://www.instagram.com/drmousecz/"
                rel="noreferrer"
                target="_blank"
                className="icon social instagram"
                title="Dr.Mouse na instagramu"
              ></a>
            </div>
          </div>
          <div className="right">
          </div>
        </div>
      </div>
      {!cookiesApproved && (
        <div id="consentPopup">
          <button type="reset" onClick={approveCookie} className="close" role="button" aria-label="Zavřít">
            <svg id="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              {" "}
              <path d="M39.503 32l22.963-22.963c2.046-2.046 2.046-5.457 0-7.503s-5.456-2.046-7.503 0l-22.963 22.963-22.963-22.963c-2.046-2.046-5.457-2.046-7.503 0s-2.046 5.457 0 7.503l22.963 22.963-22.963 22.963c-2.046 2.046-2.046 5.456 0 7.503s5.457 2.046 7.503 0l22.963-22.963 22.963 22.963c2.046 2.046 5.456 2.046 7.503 0s2.046-5.456 0-7.503l-22.963-22.963z"></path>
            </svg>
          </button>{" "}
          <p>
            {" "}
            Používáme cookies, abychom věděli jak jsou naše stránky používány a jak je můžeme dále vylepšit.{" "}
            {/*  We use cookies to understand how you use our site and to improve your experience. By continuing to use our site, you accept our */}
            {/*                         <a href="https://policies.google.com/technologies/cookies?hl=cs">Více o cookies</a> a{" "}
                        <a href="https://policies.google.com/privacy?hl=cs">zásady ochrany osobních údajů</a>.{" "} */}
            <a href="https://policies.google.com/technologies/cookies?hl=cs">Více o cookies</a> a{" "}
            <Link href="/privacy-policy">
              <a href="/privacy-policy">Zásady ochrany osobních údajů</a>
            </Link>
          </p>{" "}
          <button className="button" onClick={approveCookie} role="button" aria-label="Souhlasím s cookies">
            V pořádku
          </button>{" "}
        </div>
      )}
    </footer>
  );
};
export default withNotie(Footer);
