import React from "react";
import ReactDOM from "react-dom";
import Layout from "../layouts/Loggedout.js";
import { render, cleanup, asFragment } from "@testing-library/react";

afterEach(cleanup);

it("test exists but doesnt do anything", () => {
    const div = document.createElement("div");
    ReactDOM.render(<div />, div);
});

/* it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <Layout
            bodyClass="my"
            hero={{
                title: "Moje zvěř",
                content:
                    "Stačí se přihlásit pod e-mailovou adresou a můžete si pohodlně na jednom místě uchovávat důležité údaje o vašem zvířátku – data narození, očkování, odčervení, vyšetření... Naše aplikace se pak postará, abyste na nic důležitého nezapomněli. Ukládat zde můžete také cestovní dokumenty nebo záznamy z vyšetření u veterináře."
            }}
        />,
        div
    );
});

it("matches previous snapshot", () => {
    const { asFragment } = render(
        <Layout
            bodyClass="my"
            hero={{
                title: "Moje zvěř",
                content:
                    "Stačí se přihlásit pod e-mailovou adresou a můžete si pohodlně na jednom místě uchovávat důležité údaje o vašem zvířátku – data narození, očkování, odčervení, vyšetření... Naše aplikace se pak postará, abyste na nic důležitého nezapomněli. Ukládat zde můžete také cestovní dokumenty nebo záznamy z vyšetření u veterináře."
            }}
        />
    );
    expect(asFragment()).toMatchSnapshot();
});
 */
