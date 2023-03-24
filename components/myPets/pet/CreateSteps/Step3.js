import { useState, useEffect } from "react";
import PetBreed from "../../../../data/PetBreeds";
const step3 = (props) => {
  const kind = props.kind;
  const letters = [...props.letters];
  const [breed, setBreed] = useState(props.breed);
  const [letter, setLetter] = useState(props.letter);
  const [text, setText] = useState("");
  useEffect(() => {
    props.setBreed(breed);
    props.setLetter(letter);
  }, [breed, letter]);
  return (
    <>
      <h1>Výběr plemene</h1>
      <input type="text" placeholder="Vyhledat" style={{marginTop: "2rem"}} onChange={(e) => setText(e.target.value)}></input>
      <div className="letters">
        {letters.map((item) => (
          <React.Fragment key={Math.random()}>
            {item === letter ? (
              <span key={`adam${letter}`} className="letterChecked" onClick={() => setLetter(item)} id={item}>
                {item}
              </span>
            ) : (
              <span key={`adam${letter}`} className="letterUnchecked" onClick={() => setLetter(item)} id={item}>
                {item}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="breeds">
        {PetBreed.filter((item) => item.kind === kind)
          .filter((item) => text.length > 0 ? item.breed.toLowerCase().includes(text.toLowerCase()) : letter ? item.breed.startsWith(letter) : null)
          .map((item, index) => (
            <React.Fragment key={Math.random()}>
              {item.breed == breed ? (
                <span
                  className="checked"
                  key={`adam${index}`}
                  onClick={() => setBreed(item.breed)}
                  id={item.breed}
                >
                  {item.breed}
                </span>
              ) : (
                <span
                  className="unchecked"
                  key={`adam${index}`}
                  onClick={() => setBreed(item.breed)}
                  id={item.breed}
                >
                  {item.breed}
                </span>
              )}
            </React.Fragment>
          ))}
      </div>
    </>
  );
};
export default step3;
