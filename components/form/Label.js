import React from 'react';

const Label = ({htmlFor, value, className, id}) => {
    return(
        <label htmlFor={htmlFor} className={`formLabel ${className || ""}`} id={id}>{value}</label>
    )
}

export default Label;
