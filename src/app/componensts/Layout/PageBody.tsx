import { AppContext } from '@/app/global/AppProvider';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
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
    const { baseBible, parallelBibles } = useContext(AppContext);
    const { currentBook, currentChapter } = baseBible;
    const classes = useStyle();
    return (
        <div className={classes.root}>
            {!currentBook && !currentChapter && <BookContainer />}
            {!!currentBook && !currentChapter && <ChapterContainer />}
            {!!currentBook && !!currentChapter && (
                <div className={classes.main}>
                    <VersContainer bible={baseBible} />
                    {parallelBibles.map(x => <VersContainer key={x.id} bible={x} />)}
                </div>
            )}
        </div>
    );
});
