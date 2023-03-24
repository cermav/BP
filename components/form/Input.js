import React from 'react';

const Input = React.forwardRef(({type, name, value, defaultValue, id, className, required, autocomplete, readonly = false, onChange}, ref) => {
    return(
        <input 
            type={type} 
            name={name} 
            value={value === null ? "" : value}
            defaultValue={defaultValue === null ? "" : defaultValue}
            id={id} 
            className={`formInput ${className || ""}`} 
            required={required} 
            readOnly={readonly}
            onChange={onChange} 
            autoComplete={autocomplete} 
            ref={ref} />
    )
})
export default Input;