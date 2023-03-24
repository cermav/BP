import React from "react";
import ReactDOM from "react-dom";
// import Map from "../components/map/Map";
import { render, cleanup, asFragment } from "@testing-library/react";

afterEach(cleanup);

it("test exists but doesnt do anything", () => {
    const div = document.createElement("div");
    ReactDOM.render(<div />, div);
});

/* 
unfortunately the mapbox requires browser so we are unable to test
 */
