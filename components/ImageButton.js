import React from "react";

const ImageButton = (props) => {
    const sign = props.sign ? props.sign : null;
    const text = props.text ? props.text : null;
    const show = props.show;
    const passClass = props?.passClass;
    const color = props.color ? props.color: "black";
    const imagePosition = props.imgPosition ? props.imgPosition : "right";
    const cursor = props.cursor ? props.cursor : "initial";
    const imgWidth = props?.imgWidth;

    const classNameHandler = () => {
        return "imageButton" + (passClass ? (" " + passClass) : "") + " " + imagePosition;
    }
    return (
        <div className={classNameHandler()} onClick={show} style={{color: color, cursor: cursor}}>
            <div className="text">{text}</div>
            {sign && <img src={sign} alt="icon" style={{width : imgWidth}}></img>}
        </div>
    );
};
export default ImageButton;
