import React from "react";

const TagItem = (props) => {
  const handleClick = (ev) => {
    //    ev.target.classList.toggle("active");
    //        console.log(props.item.id);
    if (props.onItemClick) {
      props.onItemClick(props.item.id);
    }
  };
  // console.log(props.activeItem + " a " + props.item.id);
  return (
    <span
      className={
        "tag big" +
        (typeof props.onItemClick === "undefined" ? " nonClickable" : "") +
        (props.activeItem === props.item.id ? " active " : " ") +
        (props.collapsable && props.collapsable === true
          ? props.hidden && props.hidden === true
            ? " hidden"
            : " visible"
          : "")
      }
      key={props.id}
      onClick={handleClick}
    >
      #&nbsp;
      {props.item.name}
    </span>
  );
};
export default TagItem;
