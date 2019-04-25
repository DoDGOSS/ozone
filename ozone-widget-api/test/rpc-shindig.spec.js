const fs = require("fs");

const MESSAGE_TIMEOUT = 1000;

let shindigJson;
let shindigRpc;

describe("Shindig RPC", () => {

    beforeAll(() => {
        shindigJson = fs.readFileSync("vendor/shindig-1.0/json.js");
        shindigRpc = fs.readFileSync("vendor/shindig-1.0/rpc.js");
    });

    test("receives postMessage", async () => {
        // Given:
        const clientWindow = createRpcClientWindow();
        const receiveNextMessage = nextMessage();

        // When:
        clientWindow.eval('gadgets.rpc.call("..", "service", null, "arg1", "arg2");');

        // Then:
        const event = await receiveNextMessage;

        expect(event.data).toEqual(expect.any(String));

        const message = JSON.parse(event.data);
        expect(message).toEqual({
            s: "service",
            f: "nodejs",
            c: 0,
            a: ["arg1", "arg2"],
            t: 0
        });
    });

    test("register receives parsed message", async () => {
        // Given:
        loadShindig();
        const clientWindow = createRpcClientWindow();
        const receiveNextMessage = nextRpcMessage("service");

        // When:
        clientWindow.eval('gadgets.rpc.call("..", "service", null, "arg1", "arg2");');

        // Then:
        const message = await receiveNextMessage;
        expect(message).toEqual(["arg1", "arg2"]);
    })

});

function createRpcClientWindow() {
    var frame = window.document.createElement("iframe");
    window.document.body.appendChild(frame);
    frame.contentWindow.eval(shindigJson + "; " + shindigRpc + '; gadgets.rpc.setRelayUrl("..", "*");');
    return frame.contentWindow;
}

function loadShindig() {
    window.eval(shindigJson + "; " + shindigRpc + '; window.gadgets = gadgets;');
}

function nextMessage() {
    return new Promise((resolve, reject) => {
        const rejectTimeout = setTimeout(() => {
            window.removeEventListener("message", listener);
            reject("timed out waiting to receive message");
        }, MESSAGE_TIMEOUT);

        function listener(event) {
            clearTimeout(rejectTimeout);
            window.removeEventListener("message", listener);
            resolve(event);
        }

        window.addEventListener("message", listener);
    });
}

function nextRpcMessage(service) {
    return new Promise((resolve, reject) => {
        const rejectTimeout = setTimeout(() => {
            gadgets.rpc.unregister(service);
            reject(`timed out waiting for message to service '${service}'`);
        }, MESSAGE_TIMEOUT);

        gadgets.rpc.register(service, (...message) => {
            clearTimeout(rejectTimeout);
            gadgets.rpc.unregister(service);
            resolve(message);
        });
    });
}
