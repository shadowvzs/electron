import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Redirect,
} from "react-router-dom";

import { globalStore } from '../global/GlobalStore';
import { routeMap } from './routeMap';

const useStyle = makeStyles({
    root: {
        position: 'absolute',
        top: 40,
        width: '100%',
        minHeight: 'calc(100% - 40px)'
    },
});

export const Routes = observer((props: any) => {
    const routes = React.useState(() => routeMap.map(x => ({
        path: x.path,
        render: () => {
            const canRender = x.beforeRender();
            if (canRender) {
                return <x.renderCmp />;
            } else {
                return <Redirect to='/' />;
            }
        }
    })))[0];
    const history = useHistory()
    const classes = useStyle();

    React.useEffect(() => { globalStore._navigate = history.push }, []);

    return (
        <div className={classes.root}>
            <Switch>
                {routes.map(x => (
                    <Route
                        key={x.path}
                        path={x.path}
                        render={x.render}
                    />
                ))}
            </Switch>
        </div>
    );
});
