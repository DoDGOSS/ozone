declare namespace owfdojo {

    const isIE: number;

    const isFF: number;

    function addClass(node: string | Node, classStr: string | string[]): void;

    function addOnLoad(callback: Function): void

    function body(): Node;

    function connect(object: any, event: string, context: any, method: string | Function): any[];

    function create(tag: string, attrs: any, refNode: string | Node, pos?: string): Node;

    function disconnect(handle: any[]): void;

    function hasClass(node: string | Node, classStr: string): boolean;

    function hitch(scope: any, method: Function | string, ...args: any[]): Function;

    function indexOf(array: any[], value: any, fromIndex?: number, findLast?: boolean): number;

    function isDescendant(node: string | Node, ancestor: string | Node): boolean;

    function fromJson(value: string): any;

    function toJson(value: any): string;

    function mixin(object: any, ...props: any[]): any;

    function objectToQuery(map: any): string;

    function removeClass(node: string | Node, classStr: string | string[]): void;

    function style(node: string | Node, styleProperty?: string | any, value?: string): any;

    function query(selector: string, root: any): any;

    function xhr(method: string, args: any, hasBody?: boolean): any;

    class Deferred {

        constructor(canceller: any);

        resolve(value: any): void;

    }

}


declare namespace owfdojox {

    namespace secure {

        namespace capability {
            function validate(script: string, safeLibraries: string[], safeGlobals: {[id: string]: string}): void;
        }

    }

    namespace io {

        namespace windowName {

            function send(method: string, args: any): any;

        }

    }

}
