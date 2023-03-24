import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

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
    <Tippy
      content={
        <span>
          {props.item.name}
          <br />
          {props.item.title}
        </span>
      }
    >
      <span
        className={
          "avatar" +
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
        {/*             {props.item.} */}
        <img
          alt={props.item.name}
          //   src="/images/consult/milan-stourac.jpg"
          src={props.item.image.data.thumbnails[0].url}
          width="44"
          height="44"
        />
      </span>
    </Tippy>
  );
};
export default TagItem;
