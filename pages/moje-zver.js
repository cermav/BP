import React from "react";

/* Custom components */
import Layout from "../layouts/Loggedout";

import { withRedux } from "../components/hoc/withRedux";

const My = () => {
  return (
    <Layout
      bodyClass="my"
      heroHtml={false}
      hero={{
        title: "Moje zvěř",
        content:
          "Stačí se přihlásit pod e-mailovou adresou a můžete si pohodlně na jednom místě uchovávat důležité údaje o vašem zvířeti.",
        button: "Přihlásit",
        buttonURL: "/login",
      }}
    >
      <h2>Jak to funguje a co už umíme?</h2>
      <div className="landingPage">
        <img className="pozadi" src="images/my/pozadi@2x.jpg" alt="pozadí"></img>
        <div className="petContent">
          <div className="promoInfo">
            <div className="promoInfoTop">
              <img className="info" src="images/my/Jerry home@2x.png" alt="info"></img>
            </div>
            <div className="bottom">
              <div className="sticky">
                <div className="cardContent">
                  <div className="inner">
                    <img className="icon" src="/images/my/pes.svg" alt="ikona-pes" />
                    <div className="text">Profil zvířátka vždy po ruce</div>
                  </div>
                </div>
                <div className="allText">
                  Založte profil vašemu mazlíčkovi a&nbsp;mějte všechny potřebné údaje od čísla čipu, přes důležitá data
                  až po aktuální fotky vždy po ruce. Packu na to.
                </div>
              </div>
            </div>
          </div>

          <div className="promoTerms">
            <div className="promoTermsTop">
              <div className="terms">
                <img className="terminy" src="images/my/terminy@2x.png" alt="termíny"></img>
              </div>
            </div>
            <div className="bottom">
              <div className="sticky">
                <div className="cardContent">
                  <div className="inner">
                    <img className="icon" src="/images/my/hodiny.svg" alt="ikona-hodiny" />
                    <div className="text">Důležité termíny na jednom místě</div>
                  </div>
                </div>
                <div className="allText">
                  Nemůžete si vzpomenout, kdy jste naposledy nechávali vaše zvířátko očkovat, nebo kdy ho čeká další
                  odčervení?
                  <br />
                  <br />
                  Důležité termíny už nemusíte držet v hlavě, naše chytrá aplikace na ně bude myslet za&nbsp;vás.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>A co připravujeme do dalších verzí?</h2>
      <div className="nextFce">
        <div className="tile records">
          <img className="iconnext" src="/images/record.svg" alt="ikona-zaznam" />
          <div>
            Záznamy z vyšetření u <br />
            veterináře
          </div>
        </div>
        <div className="tile stars">
          <img className="iconnext" src="/images/stars.svg" alt="ikona-hvezdicka" />
          <div>
            Ukládat zajímavé <br />
            články a rady
          </div>
        </div>
        <div className="tile doctor">
          <img className="iconnext" src="/images/doctor.svg" alt="ikona-doktor" />
          <div>
            Moji <br /> veterináři
          </div>
        </div>
        <div className="tile bels">
          <img className="iconnext" src="/images/bels-white.svg" alt="ikona-zvonek" />
          <div>
            Dostat upozornění na očkování,
            <br /> odčervení či vyšetření.
          </div>
        </div>
        <div className="tile dalsi">
          <div>A další...</div>
        </div>
      </div>
    </Layout>
  );
};
export default withRedux(My);
