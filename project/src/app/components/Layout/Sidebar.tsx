import React from 'react';
import { makeStyles } from '@mui/styles';
import { observer, useObserver } from 'mobx-react-lite';

import { AppContext } from '@/app/core/AppProvider';

const useStyle = makeStyles({
    root: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        backgroundColor: 'rgba(250,250,255,0.95)',
        borderLeft: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 0 5px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: '0.3 ease',
        overflow: 'auto',
        zIndex: 1
    },
    main: {
        display: 'flex',
        padding: 8
    },
    closeBtn: {
        fontSize: 40,
        position: 'absolute',
        top: 0,
        right: 8,
        cursor: 'pointer',
        color: 'red'
    }
});

export const Sidebar = observer(() => {
    const { sidebarService } = React.useContext(AppContext);
    const { content, title, width } = sidebarService.data;
    const classes = useStyle();

    return (
        <section className={classes.root} style={{ width: content ? width : 0 }}>
            <header style={{ padding: 16, position: 'relative' }}>
                <h2>{title}</h2>
                {content && <div
                    className={classes.closeBtn}
                    onClick={sidebarService.onClose}
                    dangerouslySetInnerHTML={{ __html: '&times;' }}
                />}
            </header>
            <main style={{ padding: 16 }}> {content} </main>
        </section>
    );
});
