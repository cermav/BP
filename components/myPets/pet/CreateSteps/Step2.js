import {useState} from "react";
import kinds from "../../../../data/PetKinds";

const step2 = (props) => {
    const sign1 = "/plus-regular.svg";
    const [kind, setKind] = useState(props.kind);
    const [gender, setGender] = useState(props.gender);
    return (
        <>
            <h1>Výběr druhu a pohlaví mazlíčka</h1>
            <div className="kinds">
                {kinds.map((item, index) => (
                    <React.Fragment key={Math.random()}>
                        {item.kind === kind ? (
                            <span onClick={() => props.setKind(item.kind)} className="checked" key={`a${index}`}
                                  id={item.kind}>
                {item.kind}
              </span>
                        ) : (
                            <span key={`b${index}`} className="unchecked" onClick={() => props.setKind(item.kind)}
                                  id={item.kind}>
                {item.kind}
              </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <p>
                <img src={sign1}/>
            </p>
            <p>
                {["Samec", "Samice"]
                    .map((genderString, index) =>
                        <span id={genderString} key={index}
                              onClick={() => {
                                  props.setGender(genderString === "Samec" ? 1 : 2);
                                  setGender(genderString === "Samec" ? 1 : 2)
                              }}
                              className={gender === 1 && genderString === "Samec" || gender === 2 && genderString === "Samice" ? "checked" : "unchecked"}>
                      {genderString}
                  </span>)}
            </p>
        </>
    );
};
export default step2;
