import propertiesMapper from "../../helpers/propertiesMapper";

import { UPDATE_PROPERTY, FETCH_PROPERTY_PENDING, FETCH_PROPERTY_ERROR } from "../actionTypes";

const initialState = {
  equipment: [],
  expertise: [],
  specialization: [],
  pending: false,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROPERTY:
      return {
        ...state,
        [propertiesMapper[action.property]]: action.data,
      };
    case FETCH_PROPERTY_PENDING:
      return {
        ...state,
        pending: action.pending,
      };
    case FETCH_PROPERTY_ERROR:
      return {
        ...state,
        error: action.error,
        pending: false,
      };
    default:
      return state;
  }
}
