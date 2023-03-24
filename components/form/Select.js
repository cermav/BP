import React from 'react';

const Select = ({name, options, className, value, defaultOption, onChange}) => {
    return(
        <select name={name} className={`formSelect ${className || ""}`} value={value} onChange={onChange}>
            {options.map(option => (
                <option value={option.id} key={`op-${option.id}`}>{option.name}</option>
            ))}
        </select>
    )
}
export default Select;