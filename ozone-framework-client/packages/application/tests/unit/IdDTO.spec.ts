import { mapIds } from "../../src/api/models/IdDTO";

describe("IdDTO", () => {
    it("mapIds", () => {
        expect(mapIds(1)).toEqual([{ id: 1 }]);
        expect(mapIds([1, 2, 3])).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
});
