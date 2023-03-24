import React from 'react';

const FormRow = (props) => {
    return(
        <div className={`formRow ${props.className || ""}`}>{props.children}</div>
    )
}

export default FormRow;