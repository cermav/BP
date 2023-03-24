import { useState, useEffect } from "react";
import kinds from "../../../../data/PetKinds";
const step2 = (props) => {
  const sign1 = "/plus-regular.svg";
  const [kind, setKind] = useState(props.kind);
  const [gender, setGender] = useState(props.gender);
  useEffect(() => {
    props.setKind(kind);
    props.setGender(gender);
  }, [kind, gender]);
  return (
    <>
      <h1>Výběr druhu a pohlaví mazlíčka</h1>
      <div className="kinds">
        {kinds.map((item, index) => (
          <React.Fragment key={Math.random()}>
            {item.kind == kind ? (
              <span onClick={() => setKind(item.kind)} className="checked" key={`a${index}`} id={item.kind}>
                {item.kind}
              </span>
            ) : (
              <span key={`b${index}`} className="unchecked" onClick={() => setKind(item.kind)} id={item.kind}>
                {item.kind}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <p>
        <img src={sign1} />
      </p>
      <p>
        {gender == 1 ? (
          <span id="Samec" key="0" className="checked" onClick={() => setGender(1)}>
            Samec
          </span>
        ) : (
          <span id="Samec" key="0" className="unchecked" onClick={() => setGender(1)}>
            Samec
          </span>
        )}
        {gender == 2 ? (
          <span id="Samice" key="1" className="checked" onClick={() => setGender(2)}>
            Samice
          </span>
        ) : (
          <span id="Samice" key="1" className="unchecked" onClick={() => setGender(2)}>
            Samice
          </span>
        )}
      </p>
    </>
  );
};
export default step2;
