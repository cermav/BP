import React, { useEffect, useState } from "react";
import TagItem from "../components/TagItem";
import Link from "next/link";

// import manageArray from "../hooks/manageArray";

// import { checkPropTypes } from "prop-types";

import { useDispatch, useSelector } from "react-redux";
// import { fetchProperties } from "../redux/actions/properties";

const TagFilter = (props) => {
  const [maxTags, setMaxTags] = useState(10);
  const windowReduxObject = useSelector((state) => state.window);
  useEffect(() => {
    //    console.log(windowReduxObject, windowReduxObject.width > 768)
    if (windowReduxObject.width > 768) {
      setMaxTags(20);
    } else {
      setMaxTags(10);
    }
  }, [windowReduxObject]);

  // const dispatch = useDispatch();
  const properties = useSelector((state) => state.properties);

  const [hiddenTags, toggleTagVis] = useState(true);

  //    console.log(properties);
  const sortedProperties =
    props.propertyName === "expertise"
      ? properties.expertise.map((element) => ({ ...element }))
      : properties.specialization.map((element) => ({ ...element }));
  sortedProperties
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((i) => {
      sortedProperties.indexOf(i) < maxTags ? (i.collapsable = false) : (i.collapsable = true);
    });

  const [dataArray, setDataArray] = useState(sortedProperties);
  /* 
    useEffect(() => {
        if (properties.equipment.length === 0 && properties.expertise.length === 0 && properties.specialization.length === 0) {
            dispatch(fetchProperties());
        }
    }, [properties.equipment.length, properties.expertise.length, properties.specialization.length]); */

  useEffect(() => {
    //        console.log(properties);
    const sortedProperties =
      props.propertyName === "expertise"
        ? properties.expertise.map((element) => ({ ...element }))
        : properties.specialization.map((element) => ({ ...element }));
    sortedProperties
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((i) => {
        sortedProperties.indexOf(i) < maxTags ? (i.collapsable = false) : (i.collapsable = true);
      });
    setDataArray(sortedProperties);
  }, [properties, maxTags]);

  //    console.log(props.activeId);
  const [activeTag, toggleTag] = useState(-1);
  const handleClick = (id) => {
    id = id === activeTag ? null : id;
    toggleTag(id);
    let activeId = id === null ? "" : dataArray.find((i) => i.id === id).id;
    handleChange({ activeId: activeId });
  };
  useEffect(() => {
    toggleTag(props.activeId);
  }, [props.activeId]);

  const handleChange = (paramObject) => {
    props.updateTags({ ...paramObject, filterId: props.filterId });
  };
  const moreTags = (ev) => {
    ev.preventDefault();
    toggleTagVis(!hiddenTags);
    //    expertArray.map(); here is where you
  };
  return (
    <div className="tagFilter">
      <strong>{props.label}</strong>
      <p className="tags">
        {dataArray &&
          dataArray.map((i) => (
            <TagItem
              key={i.id}
              id={i.id}
              item={i}
              activeItem={activeTag}
              onItemClick={handleClick}
              collapsable={i.collapsable}
              hidden={hiddenTags}
            />
          ))}
        {dataArray && dataArray.length > 10 && (
          <Link href="">
            <a className="moreTags" onClick={moreTags}>
              {hiddenTags ? "..." : "x"}
            </a>
          </Link>
        )}
      </p>
    </div>
  );
};

TagFilter.prototype = {
  filterId: "identificator",
  activeId: -1,
  label: "Tagfilter",
  propertyName: "expertise",
  // data: []
  // datasetUrl: "mobile/properties?category=3"
};

export default TagFilter;
