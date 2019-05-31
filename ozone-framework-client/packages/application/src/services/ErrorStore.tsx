import * as React from "react";

import { Subject } from "rxjs";
import { asObservable } from "../observables";
import { Intent, Position, Toaster } from "@blueprintjs/core";

interface ErrorReport {
    title: string;
    message: string;
    cause?: any;
}

export class ErrorStore {
    private readonly errors$ = new Subject<ErrorReport>();

    errors = () => asObservable(this.errors$);

    error = (title: string, message: string, cause?: any) => {
        this.errors$.next({ title, message, cause });

        console.error(new Error(`${title}: ${message}`));

        ErrorToaster.show({
            icon: "warning-sign",
            intent: Intent.DANGER,
            message: (
                <>
                    <div>{title}</div>
                    <div>{message}</div>
                </>
            )
        });
    };

    warning = (title: string, message: string, cause?: any) => {
        this.errors$.next({ title, message, cause });

        console.error(new Error(`${title}: ${message}`));

        ErrorToaster.show({
            icon: "warning-sign",
            intent: Intent.WARNING,
            message: (
                <>
                    <div style={{ fontWeight: "bold" }}>{title}</div>
                    <div>{message}</div>
                </>
            )
        });
    };

    notice = (title: string, message: string) => {
        ErrorToaster.show({
            icon: "warning-sign",
            intent: Intent.WARNING,
            message: (
                <>
                    <div style={{ fontWeight: "bold" }}>{title}</div>
                    <div>{message}</div>
                </>
            )
        });
    };
}

export const errorStore = new ErrorStore();

const ErrorToaster = Toaster.create({
    position: Position.BOTTOM_RIGHT
});
