import { DOCTOR_FETCH_ALL } from "../actionTypes";

const initialState = {
  all: [],
  current: null,
  pending: false,
  updated: null,
  validation: null,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DOCTOR_FETCH_ALL:
      return { ...state, all: action.payload };
    default:
      return state;
  }
}
