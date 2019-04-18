import { PREFERENCES } from "../unit/data";
import { Response } from "../../src/api/interfaces";

const SHOW_RESPONSES = false;

export let checkForDefaultPrefs = (data: any) => {
    data.results = 5;
    expect(data).toEqual({
        success: true,
        results: expect.anything(),
        rows: expect.arrayContaining(PREFERENCES)
    });
    expect(data.results === 5 || data.results === 6).toBeTruthy();
};

export function logResponse(response: Response<any>): void {
    if (!SHOW_RESPONSES) return;
    console.log(`Status: ${response.status}\n${JSON.stringify(response.data, null, 4)}`);
}
