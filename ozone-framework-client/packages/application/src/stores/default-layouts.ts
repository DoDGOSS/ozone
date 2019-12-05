import { dashboardApi } from "../api/clients/DashboardAPI";
import { DashboardLayout } from "../models/Dashboard";
import { ExpandoPanel, FitPanel, TabbedPanel } from "../models/panel";
import { Response } from "../api/interfaces";
import { DashboardDTO } from "../api/models/DashboardDTO";

interface Layout {
    name: string;
    iconUrl: string;
}

export const DEFAULT_LAYOUTS: Layout[] = [
    {
        name: "Fit",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_1-Fit.png"
    },
    {
        name: "Tabbed",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_1-Tabbed.png"
    },
    {
        name: "Accord-Fit",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-Accord-Fit.png"
    },
    {
        name: "Fit-Tab",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-Fit-Tab.png"
    },
    {
        name: "FitBSB",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-FitBSB.png"
    },
    {
        name: "Fit-Stack",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-FitStack.png"
    },
    {
        name: "Portal",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-Portal.png"
    },
    {
        name: "Tabbed-Accord",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_2-Tabbed-Accord.png"
    },
    {
        name: "Accord-Fit-Fit",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_3-Accord-Fit-Fit.png"
    },
    {
        name: "Tab-Fit-Fit",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_3-Tab-Fit-Fit.png"
    },
    {
        name: "Fit-4",
        iconUrl: "/images/dashboardlayouts/StockAppLayouts_4-Fit.png"
    }
];

export async function createPresetLayout(layoutName?: string, dashboardId?: number): Promise<DashboardLayout> {
    switch (layoutName) {
        case "Fit":
            return createFitLayout();
        case "Fit-4":
            return createFit4Layout();
        case "FitBSB":
            return createSplitVertical();
        case "Fit-Stack":
            return createSplitHorizontal();
        case "Tabbed":
            return createTabbedLayout();
        case "Accord-Fit":
            return createAccordianFit();
        case "Fit-Tab":
            return createFitTabbed();
        case "Portal":
            return createPortalLayout();
        case "Tabbed-Accord":
            return createTabbedAccordian();
        case "Accord-Fit-Fit":
            return createAccordFitFitLayout();
        case "Tab-Fit-Fit":
            return createTabbedFitFitLayout();
        case "copy":
            dashboardId = dashboardId ? dashboardId : 0;
            return onCopyDashboard(dashboardId);
        default:
            return {
                backgroundWidgets: [],
                tree: null,
                panels: {}
            };
    }
}

const onCopyDashboard = async (dashboardId: number): Promise<DashboardLayout> => {
    const response: Response<DashboardDTO> = await dashboardApi.getDashboard(dashboardId);
    let layout = JSON.parse(response.data.layoutConfig);
    while (typeof layout !== "object") layout = JSON.parse(layout);
    let panels = JSON.stringify(layout.panels);
    panels = panels.replace(/"userWidgetIds":/g, '"widgets":');
    panels = JSON.parse(panels);
    layout.panels = panels;
    return layout;
};

function createTabbedFitFitLayout(): DashboardLayout {
    const tabbed = new TabbedPanel();
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();

    return {
        backgroundWidgets: [],
        tree: {
            direction: "column",
            first: tabbed.id,
            second: {
                direction: "row",
                first: fitPanel1.id,
                second: fitPanel2.id
            },
            splitPercentage: 25
        },
        panels: {
            [fitPanel1.id]: fitPanel1,
            [fitPanel2.id]: fitPanel2,
            [tabbed.id]: tabbed
        }
    };
}

function createAccordFitFitLayout(): DashboardLayout {
    const accordion = new ExpandoPanel("accordion");
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();

    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: accordion.id,
            second: {
                direction: "column",
                first: fitPanel1.id,
                second: fitPanel2.id
            },
            splitPercentage: 25
        },
        panels: {
            [accordion.id]: accordion,
            [fitPanel1.id]: fitPanel1,
            [fitPanel2.id]: fitPanel2
        }
    };
}

function createTabbedAccordian(): DashboardLayout {
    const accordion = new ExpandoPanel("accordion");
    const tabbed = new TabbedPanel();
    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: tabbed.id,
            second: accordion.id,
            splitPercentage: 75
        },
        panels: {
            [accordion.id]: accordion,
            [tabbed.id]: tabbed
        }
    };
}

function createTabbedLayout(): DashboardLayout {
    const tabbed = new TabbedPanel();

    return {
        backgroundWidgets: [],
        tree: tabbed.id,
        panels: {
            [tabbed.id]: tabbed
        }
    };
}

function createPortalLayout(): DashboardLayout {
    const portal1 = new ExpandoPanel("portal");
    const portal2 = new ExpandoPanel("portal");

    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: portal1.id,
            second: portal2.id
        },
        panels: {
            [portal1.id]: portal1,
            [portal2.id]: portal2
        }
    };
}

function createAccordianFit(): DashboardLayout {
    const accordion = new ExpandoPanel("accordion");
    const fitPanel = new FitPanel();
    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: accordion.id,
            second: fitPanel.id,
            splitPercentage: 25
        },
        panels: {
            [accordion.id]: accordion,
            [fitPanel.id]: fitPanel
        }
    };
}

function createFitTabbed(): DashboardLayout {
    const fitPanel = new FitPanel();
    const tabbed = new TabbedPanel();
    return {
        backgroundWidgets: [],
        tree: {
            direction: "column",
            first: fitPanel.id,
            second: tabbed.id,
            splitPercentage: 75
        },
        panels: {
            [fitPanel.id]: fitPanel,
            [tabbed.id]: tabbed
        }
    };
}

function createFitLayout(): DashboardLayout {
    const fitPanel = new FitPanel();
    return {
        backgroundWidgets: [],
        tree: fitPanel.id,
        panels: {
            [fitPanel.id]: fitPanel
        }
    };
}

function createSplitVertical(): DashboardLayout {
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();
    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: fitPanel1.id,
            second: fitPanel2.id
        },
        panels: {
            [fitPanel1.id]: fitPanel1,
            [fitPanel2.id]: fitPanel2
        }
    };
}

function createSplitHorizontal(): DashboardLayout {
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();
    return {
        backgroundWidgets: [],
        tree: {
            direction: "column",
            first: fitPanel1.id,
            second: fitPanel2.id
        },
        panels: {
            [fitPanel1.id]: fitPanel1,
            [fitPanel2.id]: fitPanel2
        }
    };
}

function createFit4Layout(): DashboardLayout {
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();
    const fitPanel3 = new FitPanel();
    const fitPanel4 = new FitPanel();

    return {
        backgroundWidgets: [],
        tree: {
            direction: "row",
            first: {
                direction: "column",
                first: fitPanel1.id,
                second: fitPanel2.id
            },
            second: {
                direction: "column",
                first: fitPanel3.id,
                second: fitPanel4.id
            }
        },
        panels: {
            [fitPanel1.id]: fitPanel1,
            [fitPanel2.id]: fitPanel2,
            [fitPanel3.id]: fitPanel3,
            [fitPanel4.id]: fitPanel4
        }
    };
}
