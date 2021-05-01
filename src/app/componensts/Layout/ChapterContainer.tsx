import { AppContext } from '@/app/global/AppProvider';
import { translate } from '@/app/global/GlobalStore';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';

const useStyle = makeStyles({
    chapterContainer: {
        position: 'relative',
        padding: 16,
        textShadow: '1px 1px 2px #bbb',
        textAlign: 'center',
        lineHeight: '40px',
        background: '#EFFFFF',
        '& nav': {
            lineHeight: '24px',
            fontSize: 20,
            textDecoration: 'none',
            padding: '0px 5px',
            opacity: 0.8,
            display: 'inline-block',
            cursor: 'pointer',
            margin: 4,
            fontWeight: 'bolder',
            '&:hover': {
                color: 'blue',
                opacity: 1
            }
        }
    }
});

export const ChapterContainer = observer(() => {
    const { baseBible, currentLanguage } = useContext(AppContext);
    const { currentBook, setCurrentChapter } = baseBible;
    const classes = useStyle();
    const book = baseBible.books.find(x => x[0] === currentBook)!;
    const chapters = new Array(book[1]).fill(1);
    return (
        <section className={classes.chapterContainer}>
            <h1>{translate(`BOOKS.${currentBook}.NAME`)}</h1>
            <div>
                <nav>{translate(`COMMON.BACK`)}</nav>
                {currentLanguage === 'hu' && <nav>{translate(`COMMON.BOOK_SCHEME`)}</nav>}
            </div>
            <div>
                {chapters.map((_, idx) => (
                    <nav 
                        key={idx} 
                        children={idx + 1} 
                        onClick={() => setCurrentChapter(idx + 1)}
                    />
                ))}
            </div>
        </section>
    );
});