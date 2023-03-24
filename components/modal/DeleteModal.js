import PropTypes from "prop-types";
import TransparentModal from "./TransparentModal";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useRouter } from "next/router";

const deleteModal = (props) => {
  const router = useRouter();
  const title = props.title ? props.title : "odstranit";
  const id = props.id ? props.id : null;
  const hide = props.hide ? props.hide : null;
  const petId = props.petId ? props.petId : null;
  const removal = props.removal ? props.removal : null;
  const confirm = () => {
    if (removal === "pet") kill();
    if (removal === "appointment") removeAppointment();
    if (removal === "vaccine") removeVaccine();
    if (removal === "record") removeRecord();
    if (removal === "notification") removeNotification();
  };
  const kill = async () => {
    try {
      const response = await fetch(process.env.apiURL + "pets/" + petId + "/remove", {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const isClient = typeof window === "object";
      if (response.status === 404 && isClient) router.push("/moje-zver/vytvorit");
      const responseObject = await response.json();
      if (responseObject && isClient) router.push("/moje-zver/zvire/" + responseObject);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const removeAppointment = async () => {
    try {
      await fetch(process.env.apiURL + "pets/" + petId + "/appointment/" + id + "/remove", {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      props.close(Date.now());
      hide();
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const removeNotification = async () => {
    try {
      await fetch(process.env.apiURL + "vaccine/" + petId + "/setSeen/" + id, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      props.close(Date.now());
      hide();
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const removeVaccine = async () => {
    try {
      await fetch(process.env.apiURL + "vaccine/" + petId + "/remove/" + id, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      props.close(Date.now());
      hide();
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const removeRecord = async () => {
    try {
      await fetch(process.env.apiURL + "pets/" + petId + "/records/" + id + "/remove", {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      props.close(Date.now());
      hide();
    } catch (error) {
      console.log("error: " + error);
    }
  };
  return (
    <TransparentModal hasBackdrop={true} passClass={["modalBlack"]} title={title} hide={props.hide}>
      <div className="container">
        <div className="inner delete">
          <h3>{props.content}</h3>
          <p>
            <button value="Potvrdit" className="back" onClick={confirm} id="confirm">
              Potvrdit
            </button>
          </p>
        </div>
      </div>
    </TransparentModal>
  );
};

deleteModal.propTypes = {
  title: PropTypes.string,
  hide: PropTypes.func.isRequired,
};

export default deleteModal;
