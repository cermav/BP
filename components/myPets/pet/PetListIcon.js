import React from "react";
import PropTypes from "prop-types";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

const PetIcon = (props) => {
    const name = "name" in props ? props.name : null;
    const imageUrl = props.imageUrl;
    const theme = props.theme || DARK_THEME;
    const petIconClasses = ["petIcon"];
    if (theme === LIGHT_THEME) {
        petIconClasses.push("light");
    }

    return (
        <div className={petIconClasses.join(" ")}>
            <div className="imageContainer">
                {imageUrl && <img className="listAvatar" src={imageUrl} alt={name === null ? "Fotografie zvířátka" : name} style={{ borderColor: props.color }} />}
            </div>
            {name !== null ? <p className="petName">{name}</p> : null}
        </div>
    );
};

PetIcon.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    editable: PropTypes.bool,
    theme: PropTypes.string,
};

export default PetIcon;
