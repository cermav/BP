import TransparentModal from "./TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useForm } from "react-hook-form";
import { formatTimestamp } from "../../helpers/formatTimestamp";
import SafariDate from "../../helpers/SafariDate";
import Bowser from "bowser";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import vaccines from "../../data/vaccines";
import { withNotie } from "react-notie";
import { useRouter } from "next/router";

const VaccineModal = (props) => {
  const router = useRouter();
  const petId = props?.pet?.id;
  const title = props?.title;
  const hide = props.hide ? props.hide : null;
  const editVaccine = props.editVaccine ? props.editVaccine : null;
  const appointmentId = props.appointmentId ? props.appointmentId : null;
  const vetsWithDistance = props?.vetMetaArray;
  const selectedDoctor = props.selectedDoctor ? props.selectedDoctor : null;
  const oneDay = 24 * 60 * 60 * 1000;
  const browser = Bowser.getParser(window.navigator.userAgent);
  const { handleSubmit, errors, register } = useForm();

  const [allVets, setAllVets] = useState(
    typeof window === "object" && window.localStorage && window.localStorage.getItem("searchVets") !== "undefined"
      ? JSON.parse(window.localStorage.getItem("searchVets"))
      : []
  );
  const [description, setDescription] = useState(editVaccine ? editVaccine?.description : null);
  const [applyDate, setApplyDate] = useState(editVaccine ? editVaccine?.apply_date : null);
  const [validDate, setValidDate] = useState(null);
  const [validDays, setValidDays] = useState(editVaccine ? editVaccine.valid : null);
  const [price, setPrice] = useState(editVaccine ? editVaccine?.price : 0);
  const [vaccine, setVaccine] = useState(editVaccine ? editVaccine?.name : null);
  const [notes, setNotes] = useState(editVaccine ? editVaccine?.notes : null);
  const [doctor, setDoctor] = useState(editVaccine ? editVaccine?.doctor_id : null);
  const [vaccinesArray, setVaccinesArray] = useState([]);
  const [currentId, setCurrentId] = useState(editVaccine ? editVaccine?.doctor_id : null);
  const [vetSearch, setVetSearch] = useState(false);

  useEffect(() => {
    if (currentId && document.getElementById(currentId))
      document.getElementById(currentId).className = "vetMeta selected";
  }, [(vetSearch, selectedDoctor, document?.getElementById(currentId)), currentId]);

  /*
  useEffect(() => {
    if (currentId && document.getElementById(currentId))
      document.getElementById(currentId).className = "vetMeta selected";
    currentId && setDoctor(currentId);
  }, [(vetSearch, selectedDoctor, document?.getElementById(currentId)), currentId]);
*/
  const handleApplyDate = (i) => {
    if (i) {
      setApplyDate(i);
      if (validDate) {
        let result = new Date(validDate) - new Date(i);
        result = Math.round(result / oneDay);
        result++;
        setValidDays(result);
      } else if (validDays) {
        var result = new Date(Date.now());
        result.setTime(result.getTime() + validDays * oneDay);
        setValidDate(result.toISOString().slice(0, 10));
      }
      //if !validDate && validDays set valid date
    }
  };

  useEffect(() => {
    if (applyDate && errors.date1) delete errors?.date1;
    if (validDate && errors.date2) delete errors?.date2;
  }, [applyDate, validDate]);

  const handleValidDate = (i) => {
    if (i) {
      let result;
      const today = new Date(Date.now());
      if (applyDate) result = new Date(i) - today;
      result = Math.ceil(result / oneDay);
      setValidDate(i);
      setValidDays(result);
    }
  };
  const handleValidDays = (i) => {
    if (editVaccine) {
      var result = new Date(editVaccine.apply_date);
      result.setTime(result.getTime() + i * oneDay);
      setValidDate(result.toISOString().slice(0, 10));
    } else if (parseInt(i, 10) > 0) {
      var result = new Date(Date.now());
      result.setTime(result.getTime() + i * oneDay);
      setValidDate(result.toISOString().slice(0, 10));
    }
  };
  const handleCurrentId = (id) => {
    if (id === currentId) {
      setCurrentId(null);
      setDoctor(null);
    } else {
      setCurrentId(id);
      setDoctor(id);
    }
  };
  const handleOnSelect = (item) => {
    setVaccine(item);
  };
  const handleVetOnSelect = (item) => {
    setDoctor(item.user_id);
  };
  const handlePropVet = () => {
    if (editVaccine) {
      const vetIds = props?.vetsArray?.map((vet) => vet.id);
      const vetFound = vetIds.includes(editVaccine?.doctor_id);
      return !vetFound;
    }
  };
  useEffect(() => {
    const fetchVaccines = async () => {
      const response = await fetch(process.env.apiURL + "vaccines/vaccines-list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await response.json();
      setVaccinesArray(responseObject);
    };
    const fetchData = async () => {
      const response = await fetch(process.env.apiURL + "doctors-search", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseArray = await response.json();
      setAllVets(responseArray);
      if (typeof window === "object" && window.localStorage)
        window.localStorage.setItem("searchVets", JSON.stringify(responseArray));
    };
    if (typeof window === "object") window.scrollTo({ top: 0 });
    if (allVets === null || allVets?.length === 0) fetchData();
    if (editVaccine?.valid) handleValidDays(editVaccine?.valid);
    fetchVaccines();
  }, []);

  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);

  const onSubmit = async () => {
    try {
      if (!applyDate) return;
      if (!validDate) return;
      const vaccineObject = {
        apply_date: formatTimestamp(applyDate),
        pet_id: petId,
        valid: validDays >= 0 ? validDays : 0,
        description: description ? description : null,
        price: price ? price : null,
        vaccine_id: vaccine
          ? vaccine.id
            ? vaccine.id
            : editVaccine
            ? editVaccine.vaccine_id
              ? editVaccine.vaccine_id
              : null
            : null
          : null,
        doctor_id: doctor ? doctor : null,
        notes: notes ? notes : null,
      };
      if (props.type === "add") {
        const response = await fetch(process.env.apiURL + "vaccine/" + petId + "/store", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
          body: JSON.stringify(vaccineObject),
        });
        const result = await response.json();
        if (result.errors) throw new Error(result.errors);
        props.notie.success("Úspěšně přidáno!");
        const removeAppointment = async () => {
          try {
            await fetch(process.env.apiURL + "pets/" + petId + "/appointment/" + appointmentId + "/remove", {
              method: "delete",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: getAuthorizationHeader(),
              },
            });
          } catch (error) {
            console.log("error: " + error);
          }
        };
        if (props.fromAppointment) {
          removeAppointment();
          router.push({ pathname: `/moje-zver/zvire/[slug]/vakciny`, query: { slug: petId, id: result.id } });
        }
        props.close(Date.now());
        hide();
      } else if (props.type === "edit") {
        const response = await fetch(process.env.apiURL + "vaccine/" + petId + "/update/" + props.editVaccine.id, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
          },
          body: JSON.stringify(vaccineObject),
        });
        const result = await response.json();
        if (result.errors) throw new Error(result.errors);
        props.notie.success("Úspěšně upraveno!");
        props.close(Date.now());
        hide();
      }
    } catch (error) {
      props.notie.error(error);
      console.log("error: " + error);
    }
  };

  return (
    <TransparentModal hasBackdrop={true} passClass={["modalBlack vaccineModal"]} title={title} hide={hide}>
      <div className="container" id="modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="firstRow">
            <div className="description">
              <div className={errors.description && "error"}>
                <h3>Název očkování</h3>
              </div>
              <label for="description">název</label>
              <input
                className={errors.description && "error-input"}
                name="description"
                id="description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={editVaccine ? editVaccine?.description : description}
                ref={register({ required: true, maxLength: 191 })}
              />
            </div>
            <div className="date">
              <div className={errors.date1 && "error"}>
                <h3>Datum očkování</h3>
              </div>
              {/* REQUIRED SAFARI DATE !!! */}
              {browser.getBrowserName() === "Safari" ? (
                <SafariDate
                  error={errors.date1}
                  setDate={handleApplyDate}
                  date={editVaccine ? editVaccine?.apply_date : applyDate}
                />
              ) : (
                <>
                  <label for="date1">datum očkování</label>
                  <input
                    type="date"
                    id="date1"
                    name="date1"
                    className={errors.date1 ? "modal-date error-input" : "modal-date"}
                    defaultValue={editVaccine ? editVaccine?.apply_date : applyDate}
                    onChange={(e) => handleApplyDate(e.target.value)}
                    ref={register({ required: true })}
                  />
                </>
              )}
            </div>
          </div>
          <div className="val">
            <div className="valid date">
              <div className={errors.date2 && "error"}>
                <h3>Platnost do</h3>
              </div>
              {browser.getBrowserName() === "Safari" ? (
                <SafariDate error={errors.date2} setDate={handleValidDate} date={validDate} key={validDate} />
              ) : (
                <>
                  <label for="date2">datum platnosti</label>
                  <input
                    key={validDate}
                    type="date"
                    id="date2"
                    name="date2"
                    className={errors.date2 ? "modal-date error-input" : "modal-date"}
                    defaultValue={validDate}
                    onChange={(e) => {
                      handleValidDate(e.target.value);
                    }}
                    ref={register({ required: true })}
                  />
                </>
              )}
            </div>

            <div className="valid days">
              <h3>Platné dnů</h3>

              <label for="valid">počet dnů platnosti</label>
              <input
                key={validDays}
                type="text"
                id="valid"
                name="valid"
                className="modal-date"
                defaultValue={validDays > 0 ? validDays : 0}
                onChange={(e) => handleValidDays(e.target.value)}
                pattern="[0-9]*"
              />
            </div>
            <div className="price">
              <h3>Cena</h3>
              <label for="price">Cena</label>
              <input
                id="price"
                key="price"
                type="text"
                defaultValue={editVaccine ? editVaccine?.price : price}
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                placeholder="Kč"
                className="modal-date"
                pattern="[0-9]*"
              />
            </div>
          </div>
          <h3>Název vakcíny</h3>
          <div className="autoComplete" id="autoComplete">
            {vaccines && (
              <ReactSearchAutocomplete
                items={vaccinesArray}
                onChange={handleOnSelect}
                placeholder={editVaccine ? editVaccine?.name : ""}
                fuseOptions={{
                  keys: ["name", "company"],
                  ignoreLocation: true,
                  isCaseSensitive: false,
                }}
                resultStringKeyName="name"
                autoFocus={false}
                showIcon={false}
              />
            )}
          </div>
          <div
            className={(errors.notes || notes?.length >= 500) && "error"}
            style={{ display: "flex", width: "100%", justifyContent: "space-between" }}
          >
            <h3>Poznámky</h3>
            <h3 style={notes?.length >= 500 ? { color: "#dc3c43", paddingRight: "2rem" } : { paddingRight: "2rem" }}>
              {notes ? notes.length : 0}/500
            </h3>
          </div>
          <label for="notes">Poznámky</label>
          <textarea
            key="notes"
            rows={
              window.innerWidth > 576 ? (window.innerWidth > 768 ? (window.innerWidth > 992 ? "6" : "7") : "10") : "19"
            }
            className={errors.notes || notes?.length >= 500 ? "modal-date error-input" : "modal-date"}
            onChange={(e) => setNotes(e.target.value)}
            name="notes"
            maxLength="500"
            defaultValue={editVaccine ? editVaccine?.notes : notes}
            ref={register({ maxLength: 500 })}
            style={{ resize: "none" }}
          ></textarea>
          <div className="buttons">
            <input type="button" className="back" onClick={() => hide()} value="Zrušit"></input>
            <>
              <label for="submit">přidat</label>
              <input
                key="submitTerm1"
                className="submit"
                type="submit"
                value={props?.type === "add" ? "Přidat" : "Změnit"}
                id="submit"
                onClick={() => {
                  !applyDate && (errors.date1 = "date required");
                  !validDate && (errors.date2 = "date required");
                }}
              ></input>
            </>
          </div>
        </form>
      </div>
    </TransparentModal>
  );
};

export default withNotie(VaccineModal);
