import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/core/AppProvider';
import { translate } from '@/app/core/app';

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
    const { baseBible, currentLanguage, navigate } = useContext(AppContext);
    const { currentBook } = baseBible;
    const classes = useStyle();
    const book = baseBible.books.find(x => x[0] === currentBook)!;
    if (!book) { return null; }
    const chapters = new Array(book[1]).fill(1);
    return (
        <section className={classes.chapterContainer}>
            <h1>{baseBible.getBookName()}</h1>
            <div>
                <nav onClick={() => navigate(`/?bibleId=${baseBible.id}`)}>{translate(`COMMON.BACK`)}</nav>
                {currentLanguage === 'hu' && <nav>{translate(`COMMON.BOOK_SCHEME`)}</nav>}
            </div>
            <div>
                {chapters.map((_, idx) => (
                    <nav
                        key={idx}
                        children={idx + 1}
                        onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${currentBook}&chapterId=${idx + 1}`)}
                    />
                ))}
            </div>
        </section>
    );
});