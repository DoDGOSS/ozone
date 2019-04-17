const fs = require("fs");

const MESSAGE_TIMEOUT = 1000;

let postmessageRpc;

describe("PostMessage RPC", () => {

    beforeAll(() => {
        postmessageRpc = fs.readFileSync("src/kernel/rpc.js");
    });

    test("receives postMessage", async () => {
        // Given:
        const clientWindow = createRpcClientWindow();
        const receiveNextMessage = nextMessage();

        // When:
        clientWindow.eval('Ozone.internal.rpc.send("service", null, "arg1", "arg2");');

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
        loadPostmessageRpc();
        Ozone.internal.rpc.setup();

        const clientWindow = createRpcClientWindow();
        const receiveNextMessage = nextRpcMessage("service");

        // When:
        clientWindow.eval('Ozone.internal.rpc.send("service", null, "arg1", "arg2");');

        // Then:
        const message = await receiveNextMessage;
        expect(message).toEqual(["arg1", "arg2"]);
    })

});

function createRpcClientWindow() {
    var frame = window.document.createElement("iframe");
    window.document.body.appendChild(frame);
    frame.contentWindow.eval(postmessageRpc + '; Ozone.internal.rpc.setParentTargetOrigin("*");');
    return frame.contentWindow;
}

function loadPostmessageRpc() {
    window.eval(postmessageRpc + '; window.Ozone = Ozone;');
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
            Ozone.internal.rpc.unregister(service);
            reject(`timed out waiting for message to service '${service}'`);
        }, MESSAGE_TIMEOUT);

        Ozone.internal.rpc.register(service, (...message) => {
            clearTimeout(rejectTimeout);
            Ozone.internal.rpc.unregister(service);
            resolve(message);
        });
    });
}
