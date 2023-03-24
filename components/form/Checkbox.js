import React from 'react';

const Checkbox = ({label, id, name, checked, onChange}) => {
    return (
        <label className="formCheckbox formCheckboxRadioRow" htmlFor={id}>{label}
            <input type="checkbox" name={name} id={id} onChange={onChange} checked={checked} />
            <span className="checkmark"></span>
        </label>
    )
}
export default Checkbox;