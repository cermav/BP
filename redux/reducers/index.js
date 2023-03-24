import { combineReducers } from "redux";
import doctors from "./doctors";
import properties from "./properties";
import window from "./window";
import user from "./user";
import pet from "./pet";

export default combineReducers({ doctors, properties, user, window, pet });
