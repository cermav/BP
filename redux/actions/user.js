import { logout as logoutToken, getAuthorizationHeader } from "../../services/AuthToken";
import unfetch from "isomorphic-unfetch";

import { USER_FETCH, USER_FETCH_PENDING, USER_FETCH_ERROR, USER_RESET, USER_UPDATE_AVATAR } from "../actionTypes";

export const fetchUserPending = (pending) => ({
  type: USER_FETCH_PENDING,
  pending,
});
export const fetchUserError = (err) => ({
  type: USER_FETCH_ERROR,
  err,
});

export const fetchUser = (user) => ({
  type: USER_FETCH,
  payload: user,
});
export const userUpdateAvatar = (avatar) => ({
  type: USER_UPDATE_AVATAR,
  payload: avatar,
});
export const fetchUserPromise = () => {
  return unfetch(process.env.apiURL + "auth/info", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthorizationHeader(),
    },
  }).then((response) => response.json());
};

export const logout = () => {
  return (dispatch) => {
    logoutToken();
    dispatch({
      type: USER_RESET,
    });
  };
};
