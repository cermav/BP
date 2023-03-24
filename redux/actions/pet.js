import { UPDATE_AVATAR, UPDATE_BACKGROUND } from "../actionTypes";

export const updateAvatar = (avatar) => ({
    type: UPDATE_AVATAR,
    payload: avatar,
});
export const updateBackground = (background) => ({
    type: UPDATE_BACKGROUND,
    payload: background,
});
