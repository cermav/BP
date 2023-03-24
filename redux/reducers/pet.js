import { UPDATE_AVATAR, UPDATE_BACKGROUND } from "../actionTypes";

const initialState = {
  avatar: null,
  background: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_AVATAR: {
      return {
        ...state,
        avatar: action.payload,
      };
    }
    case UPDATE_BACKGROUND: {
      return {
        ...state,
        background: action.payload,
      };
    }
    default:
      return state;
  }
}
