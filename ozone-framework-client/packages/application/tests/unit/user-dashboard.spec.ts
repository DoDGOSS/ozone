import {
    validateUserDashboard,
    validateUserDashboardsGetResponse,
    validateUserDashboardStack,
    validateUserDashboardUser
} from "../../src/api/models/UserDashboardDTO";
import { validateUserWidget } from "../../src/api/models/UserWidgetDTO";

import {
    USER_DASHBOARD,
    USER_DASHBOARD_STACK,
    USER_DASHBOARD_USER,
    USER_DASHBOARDS_GET_RESPONSE,
    USER_WIDGETS
} from "./get-user-dashboards.data";

import { expectValidationSuccess } from "./assertions";

describe("validateUserDashboard", () => {
    it("validates without error", () => {
        expectValidationSuccess(validateUserDashboard, USER_DASHBOARD);
    });
});

describe("validateUserWidget", () => {
    it("validates without error", () => {
        expectValidationSuccess(validateUserWidget, USER_WIDGETS[0]);
    });
});

describe("validateUserDashboardUser", () => {
    it("validates without error", () => {
        expectValidationSuccess(validateUserDashboardUser, USER_DASHBOARD_USER);
    });
});

describe("validateUserDashboardStack", () => {
    it("validates without error", () => {
        expectValidationSuccess(validateUserDashboardStack, USER_DASHBOARD_STACK);
    });
});

describe("validateUserDashboardsGetResponse", () => {
    it("validates without error", () => {
        expectValidationSuccess(validateUserDashboardsGetResponse, USER_DASHBOARDS_GET_RESPONSE);
    });
});
