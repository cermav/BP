import TransparentModal from "./TransparentModal";
import ToggleModalContent from "./ToggleModalContent";
import RecordsModal from "./RecordsModal";
import VaccineModal from "./VaccineModal";

import React, { useState, useEffect } from "react";

const ForwardModal = (props) => {
  const title = props.title ? props.title : "odstranit";
  const pet = props.pet ? props.pet : null;
  const vetsArray = props.vetsArray ? props.vetsArray : null;
  const vetMetaArray = props.vetMetaArray ? props.vetMetaArray : null;
  const appointment = props.appointment ? props.appointment : null;
  const [hide, setHide] = useState(false);
  return (
    <TransparentModal
      hasBackdrop={true}
      passClass={["modalBlack forwardModal"]}
      title={!hide ? title : null}
      hide={props.hide}
    >
      <div className="container">
        <div className="content">
          <ToggleModalContent
            toggle={(show) => (
              <a onClick={() => (show(), setHide(true))} id="addTerm">
                <div id="records" style={hide ? { display: "none" } : { display: "initial" }}>
                  <div
                    className="tile records"
                    style={{
                      backgroundImage: `url("/images/elephant.png")`,
                    }}
                  >
                    <p>Vyšetření</p>
                  </div>
                </div>
              </a>
            )}
            content={(hide) => (
              <RecordsModal
                type="add"
                key="addModal"
                fromAppointment
                vetsArray={vetsArray}
                vetMetaArray={vetMetaArray}
                vaccines={vaccines}
                editRecord={appointment}
                appointmentId={appointment.id}
                selectedDoctor={appointment.doctor_id}
                pet={pet}
                title="Vytvořit záznam pro:"
                hide={() => (hide(), setHide(false))}
              />
            )}
          />
          <ToggleModalContent
            toggle={(show) => (
              <a onClick={() => (show(), setHide(true))} id="addTerm">
                <div id="vaccines" style={hide ? { display: "none" } : { display: "initial" }}>
                  <div
                    className="tile logs"
                    style={{
                      backgroundImage: `url("/images/horse.png")`,
                    }}
                  >
                    <p>Očkování</p>
                  </div>
                </div>
              </a>
            )}
            content={(hide) => (
              <VaccineModal
              type="add"
              key="addModal"
              fromAppointment
                vetsArray={vetsArray}
                vetMetaArray={vetMetaArray}
                vaccines={vaccines}
                editVaccine={appointment}
                appointmentId={appointment.id}
                selectedDoctor={appointment.doctor_id}
                vaccine={{
                  description: appointment.description,
                  apply_date: appointment.date,
                }}
                appointment={appointment}
                pet={pet}
                title="Vytvořit záznam pro:"
                hide={() => (hide(), setHide(false))}
              />
            )}
          />
        </div>
      </div>
    </TransparentModal>
  );
};

export default ForwardModal;
