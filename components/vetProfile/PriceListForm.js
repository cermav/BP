import React, {useEffect, useState} from 'react';
import {withNotie} from 'react-notie'
import PropTypes from 'prop-types'
import unfetch from 'isomorphic-unfetch';
import {getAuthorizationHeader} from '../../services/AuthToken';
import Checkbox from "../form/Checkbox";
import FormRow from "../form/FormRow";
import Input from "../form/Input";
import Submit from "../form/Submit";

const PriceListForm = ({notie}) => {
    const [oldInputs, setOldInputs] = useState([
        {description: "", price: "", currency: "", display: false}
    ]);
    const [newInputs, setNewInputs] = useState([]);

    const [deleteItems, setDeleteItems] = useState([]);

    const handleOldChange = (e, index) => {
        const tempInputs = [...oldInputs];
        tempInputs[index][e.target.name] = e.target.value;
        setOldInputs(tempInputs);
    };

    const handleNewChange = (e, index) => {
        const tempInputs = [...newInputs];
        tempInputs[index][e.target.name] = e.target.value;
        setNewInputs(tempInputs);
    };

    const handleOldCheckboxChange = (e, index) => {
        const tempInputs = [...oldInputs];
        tempInputs[index].display = e.target.checked;
        setOldInputs(tempInputs);
    };

    const handleNewCheckboxChange = (e, index) => {
        const tempInputs = [...newInputs];
        tempInputs[index].checked = e.target.checked;
        setNewInputs(tempInputs);
    };

    useEffect(() => {
        const fetchStates = async () => {
            const response = await unfetch(`${process.env.apiURL}doctor/price-list/get`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader(),
                },
            });
            const responseObject = await response.json();

            responseObject.forEach(item => {
                item.display = !!+item.display;
                item.key = new Date().getTime();
            })

            setOldInputs(responseObject);
        };

        fetchStates();
    }, []);

    const formSubmit = async (e) => {
        e.preventDefault();
        const updateChartItems = async () => {
            const response = await unfetch(`${process.env.apiURL}doctor/price-list/update`, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader()
                },
                body: JSON.stringify(oldInputs)
            });

            if (response.status === 200) {
                // updated
                notie.success('Data byla upravena')
            } else {
                notie.error('Nastala chyba při upravování: ' + data.message)
            }
        }

        const createChartItems = async () => {
            const response = await unfetch(`${process.env.apiURL}doctor/price-list/create`, {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader()
                },
                body: JSON.stringify(newInputs)
            });

            if (response.status === 200) {
                // updated
                notie.success('Data byla upravena')
            } else {
                notie.error('Nastala chyba při upravování: ' + data.message)
            }
        }

        const deleteChartItems = async () => {
            const response = await unfetch(`${process.env.apiURL}doctor/price-list/delete`, {
                method: "delete",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader()
                },
                body: JSON.stringify(deleteItems)
            });

            if (response.status === 200) {
                // updated
                notie.success('Data byla upravena')
            } else {
                notie.error('Nastala chyba při upravování: ' + data.message)
            }
        }

        try {
            await updateChartItems();

            if (newInputs.length > 0) {
                await createChartItems();
            }

            if (deleteItems.length > 0) {
                await deleteChartItems();
            }
        } catch (err) {
            notie.error('Nastala chyba při ukládání: ' + err)
        }
    }

    const addRow = () => {
        setNewInputs([...newInputs, {
            description: "",
            price: "",
            currency: "",
            display: false,
            key: new Date().getTime()
        }]);
    };

    const removeOldRow = (index) => {
        setDeleteItems([...deleteItems, oldInputs[index]]);

        setOldInputs(oldInputs.filter((_, i) => i !== index));
    };

    const removeNewRow = (index) => {
        setNewInputs(newInputs.filter((_, i) => i !== index));
    };

    return (
        <form className="priceList" onSubmit={formSubmit} noValidate autoComplete="off" id="priceForm">
            <div className="priceList-header" >
                <span className="description tag">Popis</span>
                <span className="price tag">Cena</span>
                <span className="currency tag">Měna</span>
                <span className="display tag">Zobrazit</span>
                <span className="buttonPlaceholder"></span>
            </div>
            {oldInputs && oldInputs.map((input, index) => (
                <FormRow key={"row" + index}>
                    <Input
                        className="description"
                        key={input.key}
                        type="text"
                        name="description"
                        id="description"
                        defaultValue={input.description}
                        onChange={(e) => handleOldChange(e, index)}
                        required={true}
                    />
                    <Input
                        className="price"
                        type="number"
                        name="price"
                        value={input.price}
                        onChange={e => handleOldChange(e, index)}
                        required={true}
                    />
                    <Input
                        className="currency"
                        name="currency"
                        value={input.currency}
                        onChange={e => handleOldChange(e, index)}
                        required={true}
                    />
                    <Checkbox
                        className="display"
                        checked={input.display}
                        onChange={(e) => handleOldCheckboxChange(e, index)}
                    />
                    <input className="removeRowButton" type="button" onClick={() => removeOldRow(index)} value="Odstranit"/>
                </FormRow>
            ))}

            {newInputs && newInputs.length > 0 && (
                <div className="divider">Nové položky</div>
            )
            }

            {newInputs && newInputs.map((input, index) => (
                <FormRow key={index}>
                    <Input
                        className="description"
                        type="text"
                        name="description"
                        value={input.description}
                        onChange={e => handleNewChange(e, index)}
                        required={true}
                    />
                    <Input
                        className="price"
                        type="number"
                        name="price"
                        value={input.price}
                        onChange={e => handleNewChange(e, index)}
                        required={true}
                    />
                    <Input
                        className="currency"
                        type="text"
                        name="currency"
                        value={input.currency}
                        onChange={e => handleNewChange(e, index)}
                        required={true}
                    />
                    <Checkbox
                        className="display"
                        checked={input.display}
                        onChange={(e) => handleNewCheckboxChange(e, index)}
                    />
                    <input className="removeRowButton" type="button" onClick={() => removeNewRow(index)} value="Odstranit"/>
                </FormRow>
            ))}

            <FormRow>
                <input type="button" onClick={addRow} value="Přidat"/>
            </FormRow>

            <FormRow>
                <Submit type="submit" value="uložit"/>
            </FormRow>
        </form>
    )
}

PriceListForm.propTypes = {
    userId: PropTypes.number.isRequired,
    doctorServices: PropTypes.array.isRequired,
}

export default withNotie(PriceListForm);