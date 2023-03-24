import React from "react";
import ReactDOM from "react-dom";
import Loader from "../components/Loader";
import { render, cleanup, asFragment } from "@testing-library/react";

afterEach(cleanup);

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Loader />, div);
});

it("matches previous snapshot", () => {
    const { asFragment } = render(<Loader />);
    expect(asFragment()).toMatchSnapshot();
});
