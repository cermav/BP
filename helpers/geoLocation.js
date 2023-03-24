import {calculateDistance} from "./calculateDistance";

export const getUsersLocation = (coordsFromLS) => {
    navigator.geolocation.getCurrentPosition((position) => {
        const distanceFromLastTime = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            coordsFromLS.lat,
            coordsFromLS.long
        );
        if (distanceFromLastTime > 1) {
            localStorage.setItem("lat", position.coords.latitude.toString());
            localStorage.setItem("long", position.coords.longitude.toString());
        }
    });
};

export const addDistances = (allPins, userCoordinates) => {
    let newPins = allPins.map((element) => ({...element}));
    if (userCoordinates !== false) {
        newPins.forEach((element) => {
            element.distance = calculateDistance(
                userCoordinates.latitude,
                userCoordinates.longitude,
                element.latitude,
                element.longitude
            );
        });
    }

    return newPins;
};

/**
 * Gets geolocation from Local Storage
 * @returns object with geolocation latitude and longitude
 */
export const coordsFromLS = () => {
    const location = {};

    location.lat = getLocalStorageItem("lat");
    location.long = getLocalStorageItem("long");

    return location;
}

/**
 *
 * @param Local storage key
 * @returns {number|string} local storage value
 */
const getLocalStorageItem = (key) => {
    return typeof window === "object" &&
    window.localStorage.getItem(key) !== null &&
    typeof window === "object" &&
    window.localStorage.getItem(key) !== ""
        ? parseFloat(typeof window === "object" && window.localStorage.getItem(key))
        : "";
}