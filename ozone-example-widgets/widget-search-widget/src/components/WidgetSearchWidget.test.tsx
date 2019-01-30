import React from "react";
import ReactDOM from "react-dom";
import { WidgetSearchWidget } from "./WidgetSearchWidget";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<WidgetSearchWidget/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
