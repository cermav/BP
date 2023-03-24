import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { withNotie } from 'react-notie'
import PropTypes from 'prop-types'
import unfetch from 'isomorphic-unfetch';
import { getAuthorizationHeader } from '../../services/AuthToken';

/* Static data - remove once fetch is ready */
import { weekdays } from '../../data/weekdays';
import { openingHoursStates } from '../../data/openingHoursStates';

import FormRow from '../form/FormRow';
import Select from '../form/Select';
import Input from '../form/Input';
import Submit from '../form/Submit';

const OpeningHoursForm = ({ userId, doctorOpeningHours, notie }) => {

    const [pending, setPending] = useState(false)
    const [openingHours, setOpeningHours] = useState({});

    useEffect(() => {
        let defOpeningHours = {};
        if (doctorOpeningHours.length === 0) {
            weekdays.forEach(weekday => {
                defOpeningHours[weekday.id] = [{ id: null, state_id: "1", weekday_id: weekday.id }];
            });
        } else {
            weekdays.forEach(weekday => {
                const weekdayData = doctorOpeningHours.filter(item => item.weekday_id === weekday.id);
                defOpeningHours[weekday.id] = weekdayData;
            });
        }
        setOpeningHours(defOpeningHours);
    }, [doctorOpeningHours]);

    const changeInputs = (e) => {
        const inputName = e.target.name;
        const value = (e.target.type === 'time') ? e.target.value + ':00' : e.target.value; // add seconds, needed for server validation
        const nameParts = inputName.split(/[[\]]/);
        const weekday = nameParts[1];
        const row = nameParts[3];
        const name = nameParts[5];
        let weekdayArray = { ...openingHours };
        weekdayArray[weekday][row] = { ...weekdayArray[weekday][row] };
        weekdayArray[weekday][row][name] = value;
        weekdayArray[weekday][row].weekday_id = weekday;
        if (name === "state_id" && weekdayArray[weekday][1]) {
            weekdayArray[weekday][1][name] = value;
        }
        setOpeningHours(weekdayArray);
    }

    const addRow = (weekdayId) => {
        let weekdayArray = { ...openingHours };
        weekdayArray[weekdayId].push({ id: null, state_id: "1", weekday_id: weekdayId });
        setOpeningHours(weekdayArray);
    }

    const removeRow = (weekdayId) => {
        let weekdayArray = { ...openingHours };
        weekdayArray[weekdayId].pop();
        setOpeningHours(weekdayArray);
    }

    const formSubmit = async (e) => {
        e.preventDefault();

        setPending(true)
        try {
            const response = await unfetch(process.env.apiURL + "opening-hours/" + userId, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader()
                },
                body: JSON.stringify(openingHours)
            });
            const data = await response.json();

            if (response.status === 200) {
                // updated
                setPending(false)
                notie.success('Otevírací hodiny byly aktualizovány')
            } else {
                notie.error('Nastala chyba při ukládání: ' + data.message)
            }
        } catch (err) {
            notie.error('Nastala chyba při ukládání: ' + err)
        }
    }

    return (
        <form onSubmit={formSubmit} noValidate style={{ display: "flex", flexDirection: "column" }} id="ohForm">
            {weekdays.map(weekday => {
                const weekdayOH = openingHours[weekday.id];
                const weekdayIsOpen = (weekdayOH && weekdayOH.length > 0) ? parseInt(weekdayOH[0].state_id, 10) === 1 : true;
                return (
                    <div key={weekday.id}>
                        <FormRow>
                            <span className="weekday">{weekday.name}</span>
                            <Select options={openingHoursStates} name={`[${weekday.id}][0][state_id]`} value={(weekdayOH && weekdayOH.length > 0) && weekdayOH[0].state_id} onChange={changeInputs} />
                            <Input type="time" name={`[${weekday.id}][0][open_at]`} value={(weekdayOH && weekdayOH.length > 0) ? weekdayOH[0].open_at : ''} onChange={changeInputs} readonly={!weekdayIsOpen} />
                            <Input type="time" name={`[${weekday.id}][0][close_at]`} value={(weekdayOH && weekdayOH.length > 0) ? weekdayOH[0].close_at : ''} onChange={changeInputs} readonly={!weekdayIsOpen} />
                            {weekdayOH && weekdayOH.length === 1 && weekdayIsOpen && <button className="button" type="button" onClick={() => addRow(weekday.id)}>+</button>}
                            {weekdayOH && weekdayOH.length === 2 &&
                                <FormRow>
                                    <span className="weekday2"> - </span>
                                    <Input type="time" name={`[${weekday.id}][1][open_at]`} value={weekdayOH && weekdayOH[1].open_at} onChange={changeInputs} readonly={!weekdayIsOpen} />
                                    <Input type="time" name={`[${weekday.id}][1][close_at]`} value={weekdayOH && weekdayOH[1].close_at} onChange={changeInputs} readonly={!weekdayIsOpen} />
                                    <button className="button" type="button" onClick={() => removeRow(weekday.id)}>-</button>
                                </FormRow>
                            }
                        </FormRow>
                    </div>
                )
            })}
            <FormRow>
                <Submit value="Uložit" />
            </FormRow>
        </form>
    )
}

OpeningHoursForm.propTypes = {
    userId: PropTypes.number.isRequired,
    doctorOpeningHours: PropTypes.array.isRequired,
}

export default withNotie(OpeningHoursForm);