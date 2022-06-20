import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/core/AppProvider';
import { Bible } from '@/app/model/Bible';
import { openParallelBibleSelect } from '../Modal/ParallelBibleList';
import { IVers } from '@/app/interfaces/models';

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

interface VersProp {
    vers: IVers;
    showDescription?: boolean;
    showFootNotes?: boolean;
    selected?: boolean;
    searchTerm?: string;
    setFootNoteSidebar?: (bible: Bible, footNoteId: string) => void;
}

export const VersItem = ({ vers, showDescription, showFootNotes, selected, searchTerm, setFootNoteSidebar }: VersProp) => {
    const classes = useStyle();
    let text = vers.text;
    if (searchTerm) {
        const regExp = new RegExp(searchTerm, 'ig')
        text = text.replace(regExp, `<span class='highlight'>${searchTerm}</span>`);
    }

    return (
        <div style={{ marginBottom: 8 }}>
            {vers && vers.content && showDescription && (
                <div
                    className={classes.versDescription}
                    children={vers.content}
                />
            )}
            {vers && (
                <div
                    className={classes.versItem} data-vers-id={vers.longId}
                    ref={selected ? (e: HTMLDivElement) => e && e.scrollIntoView() : undefined}
                >
                    <span className='vers-id' children={vers.id + '.'} />
                    <span
                        className='vers-text'
                        style={selected ? { fontWeight: 'bold', backgroundColor: 'yellow' } : undefined}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                    {vers.$footNotes && showFootNotes && vers.$footNotes.map((footNote, fnIdx) => (
                        <span
                            className={classes.versFootNote}
                            children={`${footNote.text} ${(vers.$footNotes!.length - 1) > fnIdx ? ',' : ''}`}
                            key={`${vers.id} ${fnIdx} ${footNote.id}`}
                            onClick={setFootNoteSidebar ? () => setFootNoteSidebar(vers.$bible!, footNote.id) : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export const VersContainer = observer(() => {
    const globalStore = useContext(AppContext);
    const { usedBibles, allVerses, baseBible, parallelBibles, setParallelBibles, setFootNoteSidebar, navigate } = globalStore;
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
                                onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${prev.bookId}&chapterId=${prev.chapterId}`)}
                                title={prev.title}
                            />
                            <nav
                                key='title'
                                onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${bible.currentBook}`)}
                                children={`${bible.getBookName()} (${bible.currentChapter}/${bible.maxChapter})`}
                            />
                            <nav
                                key='next'
                                children={`>>>`}
                                className={next.disabled ? 'disabled' : ''}
                                onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${next.bookId}&chapterId=${next.chapterId}`)}
                                title={next.title}
                            />
                            {bible.id === baseBible.id && (
                                <div
                                    className='add'
                                    children='+'
                                    onClick={() => openParallelBibleSelect().then(bibles => setParallelBibles([...bibles]))}
                                />
                            )}
                        </header>
                    )
                })}
                {allVerses.map((v, idx) => (
                    <VersItem
                        key={idx}
                        selected={baseBible.currentVers > 0 && (v.id >= baseBible.currentVers && v.id <= (baseBible.currentVers + baseBible.limit))}
                        vers={v}
                        showDescription={onlyBase}
                        showFootNotes={onlyBase}
                        setFootNoteSidebar={setFootNoteSidebar}
                    />
                ))}
            </section>
        </div>
    );
});
