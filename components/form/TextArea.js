import React from 'react';

const Textarea = ({name, id, rows, className, required, value, readonly = false, onChange}) => {
    return(
        <textarea 
            name={name} 
            rows={rows}
            value={value === null ? "" : value}
            id={id} 
            className={`formInput ${className || ""}`} 
            required={required} 
            readOnly={readonly}
            onChange={onChange} 
            />
    )
}
export default Textarea;