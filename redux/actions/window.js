import { UPDATE_WIDTH, UPDATE_HEIGHT } from "../actionTypes";

export const updateWidth = width => ({
    type: UPDATE_WIDTH,
    width
});
export const updateHeight = height => ({
    type: UPDATE_HEIGHT,
    height
});
