import React from "react";

import Layout from "../../layouts/Loggedout";

//import VetSignupForm from "../../components/VetSignupForm";
//import VetSubmitForm from "../../components/VetSubmitForm";

import { withRedux } from "../../components/hoc/withRedux";

const Signup = () => {
  return (
    <Layout bodyClass="profile" registrationPromo={false}>
      {/*                registrationPromo={false}
            bodyClass="my"
            hero={{
                title: "Někdo tady chybí!",
                content:
                    "Jsme parta zoofilních nadšenců.\nNa začátku jsme si chtěli jen usnadnit práci s hledáním veterinární ordinace, abychom nemuseli spoléhat na šeptandu mezi pejskaři na procházkách či sociálních sítích. \n Chyběl nám rychlý, jednoduchý a kompletní přehled veterinářů v ČR na jednom místě. Proto vznikl portál Dr. Mouse, kde uživatelé pohodlně najdou všechny ordinace i s praktickým hodnocením předchozích návštěvníků. \nPokud máte dobrý tip, jak bychom mohli Dr. Mouse vylepšit, napište nám. Děkujeme."
            }}
        > */}
      <div className="text-document">
        <h1>Někdo tady chybí!</h1>

        {
          //<VetSubmitForm />
          //<VetSignupForm />
        }
      </div>
    </Layout>
  );
};
export default withRedux(Signup);
