import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/global/AppProvider';
import { BookContainer } from './BookContainer';
import { ChapterContainer } from './ChapterContainer';
import { VersContainer } from './VersContainer';

const useStyle = makeStyles({
    root: {
        position: 'absolute',
        top: 40,
        width: '100%',
    },
    main: {
        display: 'flex',
    }
});

export const PageBody = observer(() => {
    const { baseBible } = React.useContext(AppContext);
    const { currentBook, currentChapter } = baseBible;
    const classes = useStyle();
    return (
        <div className={classes.root}>
            {!currentBook && !currentChapter && <BookContainer />}
            {!!currentBook && !currentChapter && <ChapterContainer />}
            {!!currentBook && !!currentChapter && <VersContainer />}
        </div>
    );
});
