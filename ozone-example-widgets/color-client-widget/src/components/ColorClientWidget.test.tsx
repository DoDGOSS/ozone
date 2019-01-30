import React from "react";
import ReactDOM from "react-dom";

import { ColorClientWidget } from "./ColorClientWidget";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ColorClientWidget/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
