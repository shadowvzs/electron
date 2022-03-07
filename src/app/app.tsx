import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppProvider } from './global/AppProvider';
import { globalStore } from './global/GlobalStore';
import { makeStyles } from '@material-ui/styles';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import { Routes } from './routes/Routes';
import { PageHeader } from './components/Layout/PageHeader';
import { Sidebar } from './components/Layout/Sidebar';
import { Loader } from './components/Loader/Loading';

const useStyle = makeStyles({
    root: {
        position: 'absolute',
        top: 40,
        width: '100%',
        minHeight: 'calc(100% - 40px)'
    },
});

const App = observer(() => {

    React.useEffect(() => {
        globalStore.init();
    }, [globalStore]);

    if (globalStore.loading) { return <Loader />; }

    return (
        <Router>
            <AppProvider store={globalStore}>
                {globalStore.baseBible && (
                    <div className="main-page">
                        <Routes />
                        <PageHeader />
                        <Sidebar />
                    </div>
                )}
            </AppProvider>
        </Router>
    );
});

export default App;
