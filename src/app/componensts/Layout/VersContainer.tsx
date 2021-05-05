import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/global/AppProvider';
import { Bible } from '@/model/Bible';

const useStyle = makeStyles({
    versContainer: {
        position: 'relative',
        display: 'grid',
        padding: 16,
        gap: 10,
        textShadow: '1px 1px 2px #bbb',
        textAlign: 'center',
        lineHeight: '40px',
        background: '#EFFFFF',
        '& header': {
            position: 'relative',
            display: 'flex',
        },
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
        },
        '& .add': {
            position: 'absolute',
            top: 0,
            color: 'white',
            right: 0,
            background: 'rgba(0,0,255, 0.5)',
            width: 32,
            fontWeight: 'bolder',
            height: 32,
            borderRadius: '50%',
            boxShadow: '0 0 4px 4px rgba(0,0,0,0.1)',
            border: '2px solid #000',
            fontSize: 32,
            lineHeight: '27px',
            fontFamily: 'arial',
            cursor: 'pointer',
            transition: '0.3s',
            '&:hover': {
                background: 'rgba(50,50,255, 0.5)',
            },
            '&:active': {
                background: 'rgba(0,0,200, 0.5)',
            },
        }
    },
    versItem: {
        textAlign: 'left',
        lineHeight: '1.2em',
        '& .vers-id': {
            fontWeight: 'bold',
            marginRight: 4,
        }
    },
    versDescription: {
        textAlign: 'left',
        fontWeight: 'bold',
        lineHeight: '1.2em',
    },
    versFootNote: {
        fontSize: '0.75em',
        fontWeight: 'bold',
        color: 'blue',
        cursor: 'pointer',
        marginLeft: 4
    }
});

const onChapterNav = (bible: Bible, bookId: string, chapterId: number) => {
    if (bookId !== bible.currentBook) {
        bible.setCurrentBook(bookId);
    }
    bible.setCurrentChapter(chapterId);
};

export const VersContainer = observer(() => {
    const globalStore = useContext(AppContext);
    const { usedBibles, allVerses, baseBible, parallelBibles, onAddBibles } = globalStore;
    const onlyBase = parallelBibles.length === 0;
    const classes = useStyle();
   
    return (
        <div>
            <section 
                className={classes.versContainer} 
                style={{
                    gridTemplateColumns: `repeat(${parallelBibles.length + 1}, 1fr)`,
                }}
            >
                {usedBibles.map(bible => {
                    const prev = bible.prevChapter;
                    const next = bible.nextChapter;
                    return (
                        <header key={bible.id}>
                            <nav
                                key='prev'
                                children={`<<<`}
                                className={prev.disabled ? 'disabled' : ''}
                                onClick={() => onChapterNav(bible, prev.bookId, prev.chapterId)}
                                title={prev.title}
                            />
                            <nav 
                                key='title'
                                onClick={() => bible.setCurrentChapter()}
                                children={`${bible.getBookName()} (${bible.currentChapter}/${bible.maxChapter})`}
                            />
                            <nav
                                key='next'
                                children={`>>>`}
                                className={next.disabled ? 'disabled' : ''}
                                onClick={() => onChapterNav(bible, next.bookId, next.chapterId)}
                                title={next.title}
                            />
                            { bible.id === baseBible.id && (
                                <div 
                                    className='add' 
                                    children='+'
                                    onClick={onAddBibles}
                                />
                            )}
                        </header>
                    )
                })}
                {allVerses.map((v, idx) => (
                    <React.Fragment key={idx}>
                        {v && v.content && onlyBase && (
                            <div 
                                className={classes.versDescription}
                                children={v.content}
                            />
                        )}
                        { v && (
                            <div className={classes.versItem}>
                                <span className='vers-id' children={v.id + '.'} />
                                <span className='vers-text' dangerouslySetInnerHTML={{ __html: v.text }} />
                                {v.$footNotes && onlyBase && v.$footNotes.map((footNote, fnIdx) => (
                                    <span 
                                        className={classes.versFootNote}
                                        children={`${footNote.text} ${(v.$footNotes!.length - 1) > fnIdx ? ',' : ''}`}
                                        key={`${idx} ${fnIdx} ${footNote.id}`} 
                                        onClick={() => alert(footNote.id)}
                                    /> 
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </section>
        </div>
    );
});
