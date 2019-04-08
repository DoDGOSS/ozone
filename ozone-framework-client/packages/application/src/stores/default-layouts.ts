import { DashboardLayout } from "../codecs/Dashboard.codec";
import { FitPanel } from "../models/dashboard/FitPanel";

interface Layout {
    name: string;
    iconUrl: string;
    LayoutConfig?: string;
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

export function createPresetLayout(layoutName: string | null): DashboardLayout {
    switch (layoutName) {
        case "Fit":
            return createFitLayout();
        case "Fit-4":
            return createFit4Layout();
        default:
            return {
                tree: null,
                panels: {}
            };
    }
}

function createFitLayout(): DashboardLayout {
    const fitPanel = new FitPanel();

    return {
        tree: fitPanel.id,
        panels: {
            [fitPanel.id]: fitPanel
        }
    };
}

function createFit4Layout(): DashboardLayout {
    const fitPanel1 = new FitPanel();
    const fitPanel2 = new FitPanel();
    const fitPanel3 = new FitPanel();
    const fitPanel4 = new FitPanel();

    return {
        tree: {
            direction: "column",
            first: {
                direction: "row",
                first: fitPanel1.id,
                second: fitPanel2.id
            },
            second: {
                direction: "row",
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
