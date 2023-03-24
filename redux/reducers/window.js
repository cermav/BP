import { UPDATE_WIDTH, UPDATE_HEIGHT } from "../actionTypes";

const isClient = typeof window === "object";
const initialState = {
  width: isClient ? window.innerWidth : undefined,
  height: isClient ? window.innerHeight : undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_WIDTH: {
      return {
        ...state,
        width: action.width,
      };
    }
    case UPDATE_HEIGHT: {
      return {
        ...state,
        height: action.height,
      };
    }
    default:
      return state;
  }
}
