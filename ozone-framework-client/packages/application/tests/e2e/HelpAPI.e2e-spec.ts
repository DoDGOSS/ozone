import { NodeGateway } from "./NodeGateway";
import { HelpAPI } from "../../src/api/clients/HelpAPI";

describe("Help API", () => {
    let gateway: NodeGateway;
    let helpApi: HelpAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        helpApi = new HelpAPI(gateway);

        await gateway.login("admin", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test(`${HelpAPI.prototype.getHelpFiles.name}`, async () => {
        const response = await helpApi.getHelpFiles();

        expect(response.status).toEqual(200);
        expect(response.data).toEqual([
            {
                children: [
                    {
                        leaf: true,
                        path: "/Sample-Help-Folder/ReadMe.pdf",
                        text: "ReadMe.pdf"
                    }
                ],
                leaf: false,
                path: "/Sample-Help-Folder/",
                text: "Sample-Help-Folder"
            },
            {
                leaf: true,
                path: "/ReadMe.pdf",
                text: "ReadMe.pdf"
            }
        ]);
    });
});
