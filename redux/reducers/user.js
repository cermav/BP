import { USER_FETCH, USER_FETCH_PENDING, USER_FETCH_ERROR, USER_RESET, USER_UPDATE_AVATAR } from "../actionTypes";

const initialState = {
  info: null,
  pending: false,
  error: null,
  avatar: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_FETCH:
      console.log("fetch");
      return { ...state, info: action.payload, pending: false, error: null };
    case USER_FETCH_PENDING:
      console.log("pending");
      return { ...state, pending: true };
    case USER_FETCH_ERROR:
      console.log("error");
      return { ...state, error: action.error, pending: false };
    case USER_RESET:
      return { ...state, info: null };
    case USER_UPDATE_AVATAR:
      return { ...state, avatar: action.payload };

    default:
      return state;
  }
}
