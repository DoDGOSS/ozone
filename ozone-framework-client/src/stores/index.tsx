import * as React from "react";

import { inject, IReactComponent, IStoresToProps, IWrappedComponent, Provider } from "mobx-react";

import { MainStore, mainStore } from "./MainStore";


export type Stores = {
    mainStore: MainStore
};


export const Inject: Injector<Stores, any, any, any> = inject.bind(inject);

export type Injector<S, P, I, C> = (fn: IStoresToProps<S, P, I, C>) => <T extends IReactComponent>(target: T) => T & IWrappedComponent<T>


export const StoreProvider: React.SFC<{ children: any }> = ({ children }) => {
    return (
        <Provider mainStore={mainStore}>
            {children}
        </Provider>
    );
};


export { MainStore } from "./MainStore";
