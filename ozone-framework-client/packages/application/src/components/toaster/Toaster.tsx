import { Intent, Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
const LocalToaster = Toaster.create({
    className: "recipe-toaster",
    position: Position.BOTTOM
});

export function showToast(props: { message: string; intent?: Intent; timeout?: number }) {
    LocalToaster.show(props);
}
