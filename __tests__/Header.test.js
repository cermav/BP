import React from "react";
import ReactDOM from "react-dom";
import Header from "../layouts/components/Header";
import { render, cleanup, asFragment } from "@testing-library/react";
// import { withRedux } from "../hoc/withRedux";

/* import { useDispatch } from "react-redux";
import configureStore from "redux-mock-store"; //ES6 modules
const middlewares = [];
const mockStore = configureStore(middlewares);

const dispatch = useDispatch(); */

import * as nextRouter from "next/router";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

afterEach(cleanup);

it("test exists but doesnt do anything", () => {
    const div = document.createElement("div");
    ReactDOM.render(<div />, div);
});

/* it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Header />, div);
});

it("matches previous snapshot", () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
});
 */
