import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppProvider } from './global/AppProvider';
import { app } from './core/app';
import { makeStyles } from '@mui/styles';
import 'reflect-metadata';

import {
    BrowserRouter as Router,
} from "react-router-dom";
import { Routes } from './routes/Routes';
import { PageHeader } from './components/Layout/PageHeader';
import { Sidebar } from './components/Layout/Sidebar';
import { Loader } from './components/Loader/Loading';

const App = observer(() => {

    React.useEffect(() => {
        app.init();
    }, [app]);

    if (app.loading) { return <Loader />; }

    return (
        <Router>
            <AppProvider store={app}>
                {app.baseBible && (
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
