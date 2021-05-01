import React, { Children } from 'react';
import { GlobalStore } from './GlobalStore';
 
export const AppContext = React.createContext<GlobalStore>(undefined!);
 
interface AppProviderProps {
    store: GlobalStore;
    children: JSX.Element;
}

export const AppProvider = (props: AppProviderProps) => {

    React.useEffect(() => () => props.store.destroy(), []);
    
    return <AppContext.Provider value={props.store} children={props.children} />;
};