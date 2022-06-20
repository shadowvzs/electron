import React from 'react';
import { App } from '../core/app';

export const AppContext = React.createContext<App>(undefined!);

interface AppProviderProps {
    store: App;
    children: JSX.Element;
}

export const AppProvider = (props: AppProviderProps) => {

    React.useEffect(() => () => props.store.destroy(), []);

    return <AppContext.Provider value={props.store} children={props.children} />;
};