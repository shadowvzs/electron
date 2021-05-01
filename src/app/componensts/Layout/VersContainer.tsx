import { AppContext } from '@/app/global/AppProvider';
import { GlobalStore, translate } from '@/app/global/GlobalStore';
import { Bible } from '@/app/models/Bible';
import { BaseBibleRepository } from '@/app/services/BaseBibleRepository';
import { ModalProps } from '@/app/services/ModalService';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';

const useStyle = makeStyles({
    versContainer: {
        position: 'relative',
        padding: 16,
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
        marginBottom: 16,
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
    }
});

const onChapterNav = (bible: Bible, bookId: string, chapterId: number) => {
    if (bookId !== bible.currentBook) {
        bible.setCurrentBook(bookId);
    }
    bible.setCurrentChapter(chapterId);
};

export const VersContainer = observer(({ bible }: { bible: Bible }) => {
    const globalStore = useContext(AppContext);
    const { baseBible, onAddBibles } = globalStore;
    const { verses, currentBook, setCurrentChapter } = bible;
    const classes = useStyle();

    const prev = bible.prevChapter;
    const next = bible.nextChapter;
    
    return (
        <section className={classes.versContainer}>
            <header>
                <nav
                    key='prev'
                    children={"<<<"}
                    className={prev.disabled ? 'disabled' : ''}
                    onClick={() => onChapterNav(bible, prev.bookId, prev.chapterId)}
                    title={prev.title}
                />
                <nav 
                    key='title'
                    onClick={() => setCurrentChapter()}
                >
                    {translate(`BOOKS.${currentBook}.NAME`, {}, bible.lang)} ({bible.currentChapter}/{bible.maxChapter})
                </nav>
                <nav
                    key='next'
                    children={">>>"}
                    className={next.disabled ? 'disabled' : ''}
                    onClick={() => onChapterNav(bible, next.bookId, next.chapterId)}
                    title={next.title}
                />
                { bible.id === baseBible.id && (
                    <div className='add' onClick={onAddBibles}> + </div>
                )}
            </header>
            <main>
                {verses.map(v => (
                    <React.Fragment key={v.id}>
                        {v.content && (
                            <div className={classes.versDescription} children={v.content} />
                        )}
                        <div className={classes.versItem} key={v.id}>
                            <span className='vers-id' children={v.id + '.'} />
                            <span className='vers-text' dangerouslySetInnerHTML={{ __html: v.text }} />
                        </div>
                    </React.Fragment>
                ))}
            </main>
        </section>
    );
});

const useModalStyle = makeStyles({
    root: {
        padding: 16,
        minWidth: 320,
        '& li': {
            display: 'flex',
            flexWrap: 'no-wrap',
            alignItems: 'center',
            '& label': {
                paddingLeft: 4
            }
        }
    },
    footer: {
        paddingTop: 16,
        textAlign: 'center',
        '& button': {
            padding: '4px 8px'
        }
    }
});

export interface ParallelBibleListProps {
    globalStore: GlobalStore;
}

export const ParallelBibleList = (props: ParallelBibleListProps & { onSuccess?: (bibles: Bible[]) => void }) => {

    const [items, setItems] = React.useState<string[]>(props.globalStore.parallelBibles.map(x => x.id));
    const { bibles, baseBible, parallelBibles } = props.globalStore;
    const availableBibles = bibles.filter(x => x.id !== baseBible.id);
    const classes = useModalStyle();

    const onSuccess = React.useCallback(() => {
        if (props.onSuccess) {
            props.onSuccess(bibles.filter(x => items.includes(x.id)));
        }
    }, [items]);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.currentTarget;
        if (checked) {
            setItems([...items, value]);
        } else {
            setItems(items.filter(x => x !== value));
        }
    }, [items]);

    return (
        <div className={classes.root}>
            <ul>
                {availableBibles.map(b => (
                    <li key={b.id}>
                        <input 
                            type='checkbox' 
                            id={'add_bible_'+b.id} 
                            value={b.id} 
                            onChange={onChange}
                            checked={items.includes(b.id)}
                        />
                        <label htmlFor={'add_bible_'+b.id} children={b.name} />
                    </li>
                ))}
            </ul>
            <div className={classes.footer}>
                <button
                    children={translate('CONFIRM')}
                    onClick={onSuccess}
                />
            </div>
        </div>
    );
}
