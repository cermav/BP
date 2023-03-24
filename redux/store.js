import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";

const initializeStore = (initialReduxState) => {
  if (typeof initialReduxState !== "undefined") {
    return createStore(rootReducer, initialReduxState, composeWithDevTools(applyMiddleware(thunk)));
  }

  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};

export default initializeStore;
