import React from "react";
import Link from "next/link";

const RegistrationPromo = (props) => {
  return (
    <div className="registrationPromo">
      <div className="container">
        <div className="registrationPromoInner">
          <div className="registrationPromoContent">
            <p className="asH1">Přidejte ordinaci</p>
            <p className="lg">Jste veterinář nebo víte o nějakém, který v naší databázi chybí?</p>
            <Link href="/moje-zver">
              <a className="button lg add" title="Registrovat veterináře">
                Tak to nás moc mrzí..
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
