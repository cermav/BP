import React from "react";
import Link from "next/link";

const RegistrationPromo = (props) => {
  return (
    <div className="registrationPromo">
      <div className="container">
        <div className="registrationPromoInner">
          <div className="registrationPromoContent">
            <p className="asH1">Zaregistrujte se!</p>
            <p className="lg">Máte doma mazlíčka a chcete ho seznámit s Dr.Mousem?</p>
            <Link href="/moje-zver/signup">
              <a className="button lg white" title="Zaregistrujte se">
                Přidej se k nám
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="registrationPromoIllustration" id="registrationPromoIllustration"></div>
    </div>
  );
};
export default RegistrationPromo;
