import React, { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const VetSearch = (props) => {
  const [allVets, setAllVets] = useState(
    typeof window === "object" && window.localStorage && window.localStorage.getItem("searchVets") !== "undefined"
      ? JSON.parse(window.localStorage.getItem("searchVets"))
      : []
  );

  const [vetName, setVetName] = useState(null);

  useEffect(() => {
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
    if (allVets === null || allVets?.length === 0) {
      fetchData();
    }

    if (props.vetId) {
      setVetName(allVets.filter((vet) => vet.user_id === 3453)?.search_name);
    }
  });

  useEffect(() => {
    if (!props?.favorites) {
      return;
    }
    
    const favIds = props?.favorites?.map((item) => item.id);
    const vetsWithoutFavorites = favIds && allVets?.filter((item) => !favIds.includes(item.user_id));
    console.log(vetsWithoutFavorites);
    setAllVets(vetsWithoutFavorites);
  }, [allVets, props?.favorites]);

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
  };

  const handleOnSelect = (item) => {
    props.setVetId(item?.user_id);
  };

  return (
    <div className="autoComplete" id="autoComplete">
      {allVets && (
        <ReactSearchAutocomplete
          items={allVets}
          placeholder={vetName}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          fuseOptions={{
            keys: ["search_name", "working_doctors_names", "city", "street"],
            ignoreLocation: true,
            isCaseSensitive: false,
          }}
          resultStringKeyName="search_name"
          autoFocus={false}
          showIcon={false}
        />
      )}
    </div>
  );
};

export default VetSearch;
