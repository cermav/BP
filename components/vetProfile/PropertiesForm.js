import React, { useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNotie } from 'react-notie'
import PropTypes from 'prop-types'
import unfetch from 'isomorphic-unfetch';
import { getAuthorizationHeader } from '../../services/AuthToken';

import manageArray from '../../hooks/manageArray';

import FormRow from '../form/FormRow';
import Submit from '../form/Submit';

const PropertiesForm = ({ title, property, propertyType, propertyId, userId, notie }) => {

    const [pending, setPending] = useState(false)
    const defProperties = useSelector(state => state.properties[propertyType]);
    const [selectedProperties, dispatchSelectedProperties] = useReducer(manageArray, property || []);

    const selectProperty = (id = null, name) => {
        if (selectedProperties.some(i => i.name === name)) {
            dispatchSelectedProperties({ type: 'removeByKey', value: name, key: 'name' })
        } else {
            dispatchSelectedProperties({ type: 'add', value: { id, name } });
        }
    }

    const formSubmit = async (e) => {
        e.preventDefault();
        setPending(true)
        /* send request with propertyID and selectedProperties */
        try {
            const response = await unfetch(process.env.apiURL + "property/" + userId, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader()
                },
                body: JSON.stringify({
                    category_id: propertyId,
                    values: selectedProperties
                })
            });
            const data = await response.json();

            if (response.status === 200) {
                // updated
                notie.success('Nastavení bylo aktualizováno')
            } else {
                notie.error('Nastala chyba při ukládání: ' + data.message)
            }
        } catch (err) {
            notie.error('Nastala chyba při ukládání: ' + err)
        }
    }

    return (
        <form onSubmit={formSubmit} noValidate autoComplete="off" id="specForm">
            <h2>{title}</h2>
            {defProperties.map((property, key) =>
                <button
                    key={`property-${key}`}
                    onClick={() => selectProperty(property.id, property.name)}
                    className={`button propertyButton ${selectedProperties.some(i => i.name === property.name) ? "selected" : ""}`}
                    type="button">
                    {property.name}
                </button>
            )}
            {/* <input type="text" name="newProperty" className="formInput" ref={inputRef} placeholder="Jiné" onChange={handleInputChange} onKeyDown={handleKeyDown} /> */}
            <FormRow>
                <Submit value="Uložit" />
            </FormRow>
        </form>
    )
}

PropertiesForm.propTypes = {
    title: PropTypes.string.isRequired,
    property: PropTypes.array.isRequired,
    propertyType: PropTypes.string.isRequired,
    propertyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
}


export default withNotie(PropertiesForm);