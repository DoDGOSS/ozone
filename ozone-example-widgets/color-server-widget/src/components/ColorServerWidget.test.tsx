import React from "react";
import ReactDOM from "react-dom";
import ColorServerWidget from "./ColorServerWidget";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ColorServerWidget/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
