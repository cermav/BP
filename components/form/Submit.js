import React from 'react';

const Submit = ({value, name, id, className, disabled, onChange}) => {
    return(
        <input type="submit" name={name} id={id} className={`formSubmit button ${className || ""}`} onChange={onChange} value={value} disabled={disabled} />
    )
}
export default Submit;