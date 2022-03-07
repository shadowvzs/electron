import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { SearchComponent } from '../Search/SearchComponent';
import { SearchResult } from '../Search/SearchResult';
import { AppContext } from '@/app/global/AppProvider';
import { observer } from 'mobx-react-lite';

const useStyle = makeStyles({
    searchContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
    },
    aside: {
        width: 320,
        background: 'linear-gradient(top, #ddd 0%, #fff 100%)',
        height: '100%',
        paddingTop: 48,
        border: '1px solid rgba(0,0,0,.2)',
        marginRight: 1
    },
    main: {
        background: 'linear-gradient(top, #ddd 0%, #fff 100%)',
        height: '100%',
        width: '100%',
        border: '1px solid rgba(0,0,0,.2)',
        overflowY: 'auto'
    }
});

export const SearchContainer = observer(() => {
    const globalStore = useContext(AppContext);
    const { isMobile } = globalStore;
    const classes = useStyle();
    return (
        <section className={classes.searchContainer} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <aside className={classes.aside} style={isMobile ? { width: 'auto', height: 'auto' } : undefined }>
                <SearchComponent />
            </aside>
            <main className={classes.main}>
                <SearchResult />
            </main>
        </section>
    );
});
