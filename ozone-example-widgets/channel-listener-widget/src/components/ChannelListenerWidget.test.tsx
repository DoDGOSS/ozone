import React from "react";
import ReactDOM from "react-dom";
import ChannelListenerWidget from "./ChannelListenerWidget";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ChannelListenerWidget/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
