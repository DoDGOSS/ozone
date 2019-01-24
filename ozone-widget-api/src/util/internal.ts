/* tslint:disable:forin */

// @ts-ignore
window.Ozone = window.Ozone || {};

// @ts-ignore
var Ozone = window.Ozone;

// @ts-ignore
namespace Ozone.util.internal {

    export const isIE: number = owfdojo.isIE;

    export const isFF: number = owfdojo.isFF;

    export const keys = {
        ESCAPE: 27,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40
    };


    export function isArray(value: unknown): boolean | null | undefined {
        if (value === null) return null;
        if (value === undefined) return undefined;

        return Array.isArray(value);
    }

    export function isArrayStrict<T>(value: T | T[]): value is T[] {
        return Array.isArray(value);
    }

    export function isFunction(value: unknown): value is Function {
        return Object.prototype.toString.call(value) === "[object Function]";
    }

    export function isObject(value: unknown): value is object {
        return value !== undefined && (value === null || typeof value === "object" || isArray(value) || isFunction(value));
    }

    export function isString(value: unknown): value is string {
        return typeof(value) === "string" || value instanceof String;
    }

    export function asArray(value: any): any[] {
        return !isArray(value) ? [value] : value;
    }

    export function onDocumentReady(callback: Function): void {
        document.addEventListener("DOMContentLoaded", (event) => { callback(); });
    }

    export function encodeQueryObject(obj: {[key: string]: string | string[]}): string {
        return  Object.keys(obj).map((key) => {
            const param = obj[key];
            return isArrayStrict(param) ? encodeQueryArray(key, param) : encodeQueryParameter(key, param);
        }).join('&');
    }

    function encodeQueryArray(key: string, values: string[]): string {
        return values.map((value) => encodeQueryParameter(key, value)).join("&");
    }

    function encodeQueryParameter(key: string, value: string): string {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    export function mixin(object: any, ...props: any[]): any {
        if(!object){ object = {}; }
        for(let i=1, l=arguments.length; i<l; i++){
            _mixin(object, arguments[i]);
        }
        return object;
    }

    function _mixin(target: any, source: any): any {
        const extraNames = ["hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
        const extraLen = extraNames.length;
        const empty: any = {};

        let i;

        for (const name in source) {
            // the "tobj" condition avoid copying properties in "source"
            // inherited from Object.prototype.  For example, if target has a custom
            // toString() method, don't overwrite it with the toString() method
            // that source inherited from Object.prototype
            const s = source[name];
            if (!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))) {
                target[name] = s;
            }
        }

        // IE doesn't recognize some custom functions in for..in
        if (extraLen && source) {
            for (i = 0; i < extraLen; ++i) {
                const name = extraNames[i];
                const s = source[name];
                if (!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))) {
                    target[name] = s;
                }
            }
        }

        return target; // Object
    }

    export function sendByWindowName(method: string, args: any): Deferred {
        return owfdojox.io.windowName.send(method, args);
    }

    export function xhr(method: string, args: any, hasBody?: boolean): any {
        return owfdojo.xhr(method, args, hasBody);
    }


    export interface Deferred {
        resolve(value: any): void;
    }

    export function createDeferred(canceller: any): Deferred {
        return new owfdojo.Deferred(canceller);
    }

}
