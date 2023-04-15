import React, { useState, useEffect } from "react";
import { getAuthorizationHeader, isVet } from "../../../services/AuthToken";
import Layout from "../../../layouts/Loggedin";
import { withRedux } from "../../hoc/withRedux";
import { formatTimestamp } from "../../../helpers/formatTimestamp";
import Step1 from "./CreateSteps/Step1";
import Step2 from "./CreateSteps/Step2";
import Step3 from "./CreateSteps/Step3";
import Step4 from "./CreateSteps/Step4";
import Step5 from "./CreateSteps/Step5";
import PetBreed from "../../../data/PetBreeds";
import { useRouter } from "next/router";

const Create = () => {
  const [storedStep, setStoredStep] = useState(
    typeof window === "object" && window.localStorage
      ? window.localStorage.getItem("step")
        ? JSON.parse(window.localStorage.getItem("step"))
        : null
      : null
  );
  const [storedPet] = useState(
    typeof window === "object" && window.localStorage
      ? window.localStorage.getItem("petObject")
        ? JSON.parse(window.localStorage.getItem("petObject"))
        : []
      : null
  );
  const [lastPet] = useState(
    typeof window === "object" && window.localStorage ? JSON.parse(window.localStorage.getItem("last_pet")) : null
  );
  const [step, setStep] = useState(storedStep ? storedStep : 1);
  const router = useRouter();
  const history = useRouter();
  const [petName, setPetName] = useState(storedPet ? storedPet.pet_name : null);
  const [birthDate, setBirthDate] = useState(storedPet ? storedPet.birth_date : null);
  const [kind, setKind] = useState(storedPet ? storedPet.kind : null);
  const [breed, setBreed] = useState(storedPet ? storedPet.breed : null);
  const [gender, setGender] = useState(storedPet ? storedPet.gender_state_id : null);
  const [chipNumber, setChipNumber] = useState(storedPet ? storedPet.chip_number : null);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const listAvailableLetters = () => {
      const selectedBreeds = PetBreed.filter((item) => {
        return item.kind === kind;
      });
      const letterWithDuplicates = selectedBreeds.map((item) => {
        return item.breed[0];
      });
      const letterWithoutDuplicates = letterWithDuplicates.filter((item, index) => {
        return letterWithDuplicates.indexOf(item) === index;
      });
      const sortedLetters = letterWithoutDuplicates.sort((itemA, itemB) => {
        return itemA > itemB ? 1 : -1;
      });
      setLetters(sortedLetters);
    };
    listAvailableLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, PetBreed]);

  let petObject = {
    pet_name: petName,
    birth_date: birthDate,
    kind: kind,
    breed: breed,
    gender_state_id: gender,
    chip_number: chipNumber,
  };
  useEffect(() => {
    const kinds = PetBreed.filter((pet) => {
      return pet.kind === kind;
    });
    const foundBreed = kinds.find((object) => {
      return object.breed === breed;
    });
    foundBreed && typeof foundBreed === "string"
      ? setBreed(foundBreed)
      : typeof foundBreed !== "undefined"
      ? setBreed(foundBreed.breed)
      : setBreed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);
  const genderId = () => {
    if (gender === 1) return "Samec";
    if (gender === 2) return "Samice";
    else return null;
  };
  const onSubmit = async () => {
    const finalObject = {
      pet_name: petName,
      birth_date: formatTimestamp(birthDate),
      kind: kind,
      breed: breed,
      gender_state_id: gender,
      chip_number: chipNumber ? chipNumber : null,
    };
    const response = await fetch(process.env.apiURL + "pets/store", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader(),
      },
      body: JSON.stringify(finalObject),
    });
    const responseObject = await response.json();
    if (response.status === 201) {
      if (typeof window === "object" && window.localStorage) window.localStorage.removeItem("petObject");
      if (typeof window === "object" && window.localStorage) window.localStorage.removeItem("step");
      await router.replace("/moje-zver/zvire/" + responseObject);
    }
  };
  useEffect(() => {
    if (typeof window === "object" && window.localStorage)
      window.localStorage.setItem("petObject", JSON.stringify(petObject));
    if (typeof window === "object" && window.localStorage) window.localStorage.setItem("step", JSON.stringify(step));
    setStoredStep(
      typeof window === "object" && window.localStorage
        ? window.localStorage.getItem("step")
          ? JSON.parse(window.localStorage.getItem("step"))
          : null
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  const [letter, setLetter] = useState(typeof breed === "string" ? breed?.charAt(0) : "A");
  return (
    <Layout bodyClass="petCreate" registrationPromo={false}>
      <div className="createContainer">
        <div className="top" key="topSection">
          <div className="pageCount">
            <button
              className="icon close"
              onClick={() =>
                lastPet === 0 ? (isVet() ? router.push("/vet/profile") : router.push("/profil")) : history.back()
              }
            ></button>
            {step}
            {`${kind === "Pes" ? `/5` : `/4`}`}
          </div>
          <div className="petStatus">
            <div className="placeHolder"></div>
            {petName && (
              <span key={petName} onClick={() => setStep(1)}>
                {petName}
              </span>
            )}{" "}
            {kind && (
              <span key={kind} onClick={() => setStep(2)}>
                {kind}
              </span>
            )}{" "}
            {gender && (
              <span key={gender} onClick={() => setStep(2)}>
                {genderId()}
              </span>
            )}{" "}
            {breed && (
              <span key={breed} onClick={() => setStep(3)}>
                {breed}
              </span>
            )}{" "}
            {birthDate && (
              <span key={birthDate} onClick={() => setStep(4)}>
                {formatTimestamp(birthDate)}
              </span>
            )}{" "}
            {chipNumber && (
              <span key={chipNumber} onClick={() => setStep(5)}>
                {chipNumber}
              </span>
            )}
          </div>
        </div>
        <div className="content">
          {step === 1 && <Step1 setPetName={setPetName} setStep={setStep} petName={petName} />}
          {step === 2 && <Step2 setKind={setKind} setGender={setGender} kind={kind} gender={gender} />}
          {step === 3 && (
            <Step3
              setBreed={setBreed}
              setStep={setStep}
              letters={letters}
              kind={kind}
              breed={breed}
              letter={letter}
              setLetter={setLetter}
            />
          )}
          {step === 4 && <Step4 setBirthDate={setBirthDate} setStep={setStep} birthDate={birthDate} />}
          {step === 5 && (
            <Step5 setChipNumber={setChipNumber} setStep={setStep} send={onSubmit} chipNumber={chipNumber} />
          )}
        </div>
        <div className="bottom">
          <div className="progressBar">
            {storedStep && (
              <>
                {step >= 1 ? <div key="1" className="checked"></div> : <div key="1" className="unchecked"></div>}
                {step >= 2 ? <div key="2" className="checked"></div> : <div key="2" className="unchecked"></div>}
                {step >= 3 ? <div key="3" className="checked"></div> : <div key="3" className="unchecked"></div>}
                {step >= 4 ? <div key="4" className="checked"></div> : <div key="4" className="unchecked"></div>}
                {kind === "Pes" && (step >= 5 ? <div className="checked"></div> : <div className="unchecked"></div>)}
              </>
            )}
          </div>
          <p>
            {step === 1 ? (
              lastPet === 0 ? (
                isVet() ? (
                  <button type="button" key={2} className="button" onClick={() => router.push("/vet/profile")}>
                    Zrušit
                  </button>
                ) : (
                  <button type="button" key={2} className="button" onClick={() => router.replace("/profil")}>
                    Zrušit
                  </button>
                )
              ) : (
                <button type="button" key={1} className="button" onClick={() => history.back()}>
                  Zrušit
                </button>
              )
            ) : null}
            {step > 1 && (
              <button type="button" key={3} className="button" onClick={() => setStep(step - 1)}>
                Vrátit o krok zpět
              </button>
            )}
            {step === 1 ? (
              <button key="forward_form" form="my_form" type="submit" className="button" id="submit">
                Pokračovat
              </button>
            ) : (
              (step === 2 && kind && gender && (
                <button
                  key="forward2"
                  type="button"
                  className="button"
                  id="submit"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                >
                  Pokračovat
                </button>
              )) ||
              (step === 3 && breed && (
                <button
                  key="forward3"
                  type="button"
                  className="button"
                  id="submit"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                >
                  Pokračovat
                </button>
              )) ||
              (step === 4 && birthDate && kind === "Pes" && (
                <button
                  key="forward4"
                  type="button"
                  className="button"
                  id="submit"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                >
                  Pokračovat
                </button>
              )) ||
              (step === 4 && birthDate && kind !== "Pes" && (
                <button
                  key="forward4"
                  type="button"
                  className="button"
                  id="submit"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Dokončit
                </button>
              )) ||
              (step === 5 && (
                <button key="forward_form" form="my_form" type="submit" className="button" id="submit">
                  Dokončit
                </button>
              ))
            )}
          </p>
          <br />
        </div>
      </div>
    </Layout>
  );
};
export default withRedux(Create);
