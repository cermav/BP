import { UPDATE_PROPERTY, FETCH_PROPERTY_PENDING, FETCH_PROPERTY_ERROR } from "../actionTypes";
import unfetch from "isomorphic-unfetch";

export const fetchPropertyPending = pending => ({
    type: FETCH_PROPERTY_PENDING,
    pending
});

export const fetchPropertyError = err => ({
    type: FETCH_PROPERTY_ERROR,
    err
});

export const updateProperty = (property, data) => ({
    type: UPDATE_PROPERTY,
    property,
    data
});

export const fetchProperties = () => {
    return dispatch => {
        dispatch(fetchPropertyPending(true));

        Promise.all([...new Array(3)].map((ignore, i) => unfetch(`${process.env.apiURL}properties?category=${i + 1}`).then(response => response.json())))
            .then(results => {
                results.forEach((result, key) => dispatch(updateProperty(key + 1, result)));
                dispatch(fetchPropertyPending(false));
            })
            .catch(err => dispatch(fetchPropertyError(err)));
    };
};

// used in withRedux
export const fetchPropertiesPromise = () => {
    return Promise.all([...new Array(3)].map((ignore, i) => unfetch(`${process.env.apiURL}properties?category=${i + 1}`).then(response => response.json())));
};
