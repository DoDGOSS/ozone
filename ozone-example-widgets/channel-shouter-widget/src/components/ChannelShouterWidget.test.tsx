import React from "react";
import ReactDOM from "react-dom";
import ChannelShouterWidget from "./ChannelShouterWidget";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ChannelShouterWidget/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
