interface Layout {
    name: string;
    iconUrl: string;
    LayoutConfig?: string;
}

export const IMAGE_ROOT_URL = "http://localhost:3000/images";

export const DEFAULT_LAYOUTS: Layout[] = [
    {
        name: "Desktop",
        iconUrl: "/dashboardlayouts/StockAppLayouts_1-Desktop.png"
    },
    {
        name: "Fit",
        iconUrl: "/dashboardlayouts/StockAppLayouts_1-Fit.png"
    },
    {
        name: "Tabbed",
        iconUrl: "/dashboardlayouts/StockAppLayouts_1-Tabbed.png"
    },
    {
        name: "Accord-Fit",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-Accord-Fit.png"
    },
    {
        name: "Fit-Tab",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-Fit-Tab.png"
    },
    {
        name: "FitBSB",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-FitBSB.png"
    },
    {
        name: "Fit-Stack",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-FitStack.png"
    },
    {
        name: "Portal",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-Portal.png"
    },
    {
        name: "Tabbed-Accord",
        iconUrl: "/dashboardlayouts/StockAppLayouts_2-Tabbed-Accord.png"
    },
    {
        name: "Accord-Fit-Fit",
        iconUrl: "/dashboardlayouts/StockAppLayouts_3-Accord-Fit-Fit.png"
    },
    {
        name: "Tab-Fit-Fit",
        iconUrl: "/dashboardlayouts/StockAppLayouts_3-Tab-Fit-Fit.png"
    },
    {
        name: "Fit-4",
        iconUrl: "/dashboardlayouts/StockAppLayouts_4-Fit.png"
    }
];
