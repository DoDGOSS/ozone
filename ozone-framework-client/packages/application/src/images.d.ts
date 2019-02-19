declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";

declare module "*.css" {
    const content: { [className: string]: string };
    export = content;
}

declare module "*.scss" {
    const content: { [className: string]: string };
    export = content;
}

declare module "*.sass" {
    const content: { [className: string]: string };
    export = content;
}
