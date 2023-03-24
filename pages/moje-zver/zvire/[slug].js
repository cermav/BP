import React, { useEffect, useState } from "react";
import Layout from "../../../layouts/Loggedin";
import fetch from "node-fetch";
import { getAuthorizationHeader } from "../../../services/AuthToken";
import PetBackground from "../../../components/myPets/pet/PetBackground";
import PetTerms from "../../../components/myPets/pet/PetTerms";
import PetInfo from "../../../components/myPets/pet/PetInfo";
import PetNotifications from "../../../components/myPets/pet/PetNotifications";
import { useRouter } from "next/router";
import { withRedux } from "../../../components/hoc/withRedux";
import Link from "next/link";
import ImageButton from "../../../components/ImageButton";
import { withUserRoute } from "../../../components/hoc/withUserRoute";

const Pet = () => {
  const router = useRouter();
  const [petObject, setPetObject] = useState(null);

  const [petsArray, setPetsArray] = useState([]);
  const [vaccineData, setVaccineData] = useState(null);
  const [updateTerms, setUpdateTerms] = useState(null);

  useEffect(() => {
    const fetchStates = async () => {
      const response = await fetch(process.env.apiURL + "pets/list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await response.json();
      setPetsArray(responseObject);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (petObject) {
      const fetchVaccines = async () => {
        const response = await fetch(process.env.apiURL + "vaccine/" + petObject?.id + "/vaccines", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await response.json();

        setVaccineData(responseObject.filter((item) => item.seen === 0));
      };
      fetchVaccines();
    }
  }, [petObject, updateTerms]);

  useEffect(() => {
    const isClient = typeof window === "object";
    if (isClient) document.documentElement.style.overflow = "scroll";
    const fetchStates = async () => {
      const result = await fetch(process.env.apiURL + "pets/" + router.query.slug, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const isClient = typeof window === "object";
      const responseObject = await result.json();
      if ((isClient && result.status == 200) || (result.status == 201 && window.localStorage)) {
        window.localStorage.setItem("last_pet", responseObject.id);
      }
      if (responseObject.id) {
        setPetObject(responseObject);
        if (isClient && window.localStorage)
          window.localStorage.setItem("petEditObject", JSON.stringify(responseObject));
      } else {
        const response = await fetch(process.env.apiURL + "pets/latest", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
        });
        const responseObject = await response.json();
        if (responseObject && responseObject !== 0 && isClient) router.push("/moje-zver/zvire/" + responseObject);
        else router.push("/moje-zver/vytvorit");
      }
    };
    fetchStates();
  }, [router.query.slug]);

  return (
    <>
      <Layout bodyClass="petDetail" registrationPromo={false}>
        {
          <>
            <div className="petDetailContainer">
              <PetBackground petList={petsArray} key={`A${petObject?.id + petsArray}`} pet={petObject} />
              <section className="topSection">
                <PetInfo key={`B${petObject?.id}`} pet={petObject} />
                <div className="rightSection">
                  <PetTerms key={`C${petObject?.id}`} pet={petObject} fetchNewTerms={updateTerms} />
                  {vaccineData?.length > 0 && (
                    <PetNotifications
                      key={`D${petObject?.id}`}
                      vaccines={vaccineData}
                      pet={petObject}
                      updateTerms={setUpdateTerms}
                    />
                  )}
                </div>
              </section>

              <div className="myLogs">
                <div className="top">
                  <h3>
                    <ImageButton
                      passClass="sectionHeader"
                      text="Moje záznamy"
                      sign="/icons/book-medical-light.svg"
                      imgPosition="left"
                      fontWeight="700"
                      imgWidth="44px"
                    ></ImageButton>
                  </h3>
                </div>
                <div className="content">
                  <Link
                    href={"/moje-zver/zvire/" + petObject?.id + "/zaznamy"}
                    as={"/moje-zver/zvire/" + petObject?.id + "/zaznamy"}
                  >
                    <a id="records">
                      <div
                        className="tile records"
                        style={{
                          backgroundImage: `url("/images/elephant.png")`,
                        }}
                      >
                        <p>Vyšetření</p>
                      </div>
                    </a>
                  </Link>
                  <Link
                    href={"/moje-zver/zvire/" + petObject?.id + "/vakciny"}
                    as={"/moje-zver/zvire/" + petObject?.id + "/vakciny"}
                  >
                    <a id="vaccines">
                      <div
                        className="tile logs"
                        style={{
                          backgroundImage: `url("/images/horse.png")`,
                        }}
                      >
                        <p>Očkování</p>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </>
        }
      </Layout>
    </>
  );
};
export default withRedux(withUserRoute(Pet));
