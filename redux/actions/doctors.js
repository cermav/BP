import {
    DOCTOR_FETCH_ALL,    
} from "../actionTypes";
import unfetch from "isomorphic-unfetch";

// used in withRedux
export const fetchDoctors = doctors => ({
    type: DOCTOR_FETCH_ALL,
    payload: doctors
});
export const fetchDoctorsPromise = () => {
    return unfetch(process.env.apiURL + "all-doctors", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(response => response.json());
};