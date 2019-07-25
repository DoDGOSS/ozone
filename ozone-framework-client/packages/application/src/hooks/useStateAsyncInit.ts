import { useEffect, useState } from "react";

/**
 * Works like useState, except you can pass in an async function as the initial value, and it will get set as soon as
 * the function returns. Really just a convenient wrapper. But with this, in a function component, the async call will
 * only be made once, instead of on every render like it would with a simple useState + async call in series at the top
 * of the function.
 */
export function useStateAsyncInit<T>(asyncInitFunction: () => Promise<T>, safeValue: T): T {
    const [data, setData] = useState<T>(safeValue);

    useEffect(() => {
        asyncInitFunction().then((result: T) => setData(result));
    }, []);

    return data;
}
