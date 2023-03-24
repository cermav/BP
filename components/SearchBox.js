import React from "react";
import { withNotie } from "react-notie";

/* Custom hooks */
import useForm from "../hooks/form";

const SearchBox = (props) => {
  const submitForm = () => {
    //    console.log(inputs.search.value);
    if (inputs.search.value.length !== 0 && inputs.search.value.length < 3) {
      props.notie.warn("Prosím zadejte alespoň 3 znaky.");
    } else {
      //      console.log(inputs.search.value)

      function scrollToElement(myElement, scrollDuration = 500) {
        const elementExists = document.querySelector(myElement);
        if (elementExists && elementExists.getBoundingClientRect) {
          const rect = elementExists.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY - 200; // a bit of space from top
          var cosParameter = (window.scrollY - elementTop) / 2,
            scrollCount = 0,
            oldTimestamp = performance.now();
          function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI) {
              window.scrollTo(0, elementTop);
              return;
            }
            window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)) + elementTop);
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
          }
          window.requestAnimationFrame(step);
        }
      }
      scrollToElement("#vetMetas");

      //            window.scrollTo()
      props.search({ fulltext: encodeURIComponent(inputs.search.value) });
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm({ search: { value: props.initialValue } }, submitForm);
  return (
    <div className="mapSearchBox">
      <div className="">
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="search"
            aria-label="Hledaný text"
            type="text"
            onChange={handleInputChange}
            defaultValue={decodeURIComponent(props.initialValue)}
          />
          <input type="submit" aria-label="Hledat" className="button submit" value="Hledat" />
        </form>
      </div>
    </div>
  );
};
SearchBox.propTypes = {
  // ...prop type definitions here
};
SearchBox.defaultProps = {
  initialValue: "",
  search: null,
};

export default withNotie(SearchBox);
