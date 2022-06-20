import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';

import { translate } from '@/app/core/app';
import { CollapseIcon } from '../icons/CollapseIcon';
import { ExpandIcon } from '../icons/ExpandIcon';
import { useObserver } from 'mobx-react-lite';
import { AppContext } from '@/app/core/AppProvider';
import { SearchStore } from './SearchStore';

const useStyle = makeStyles({
    root: {
        padding: 16,
        minWidth: 320,
        '& li': {
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            '& label': {
                paddingLeft: 4
            }
        }
    },
    bookContainer: {
        position: 'relative',
        display: 'flex',
        marginTop: 16,
        justifyContent: 'space-around'
    },
    bookGroup: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: '50%',
        '& > h5': {
            display: 'flex',
            alignItems: 'center',
            paddingBottom: 2
        },
        '& label': {
            paddingLeft: 6
        },
        '& > ul': {
            maxHeight: 600,
            overflowY: 'auto'
        }
    },
    bookList: {
        display: 'none',
        '& li label': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    },
    footer: {
        paddingTop: 16,
        textAlign: 'center',
        '& button': {
            padding: '4px 8px'
        }
    },
    expandBtn: {
        position: 'absolute',
        right: -8,
        top: -8,
        '& svg': {
            fill: 'white',
            stroke: 'rgba(0,0,0,0.5)',
            cursor: 'pointer',
            height: '2em',
            width: '2em'
        }
    },
    expandable: {
        overflow: 'hidden',
        maxHeight: 0
    },
    inputList: {
        '& li': {
            display: 'block',
        }
    }
});

export const SearchComponent = () => {
    const app = useContext(AppContext);
    const store = React.useState(() => new SearchStore(app))[0];
    const classes = useStyle();

    return useObserver(() => (
        <div className={classes.root}>
            <ul className={classes.inputList}>
                <li style={{ paddingBottom: 8 }}>
                    <input
                        type='text'
                        onChange={store.onSearchHandler}
                        value={store.searchTerm}
                        style={{ width: '100%' }}
                        onKeyUp={store.onInputEnter}
                    />
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                    <select
                        style={{ width: 'auto' }}
                        onChange={store.setWordMatchType}
                        value={store.wordMatchType}
                    >
                        {store.$avalaibleWordMatchTypes.map(wt => (
                            <option
                                key={wt}
                                value={wt}
                                children={translate(`SEARCH.WORD_TYPE.${wt}`)}
                            />
                        ))}
                    </select>
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={store.onSubmit}
                        children={translate('SEARCH.NAME')}
                    />
                </li>
                <li>
                    <input
                        type='checkbox'
                        id={'case_sensitive_search'}
                        onChange={store.setCaseSensitiveSearch}
                        checked={store.caseSensitiveSearch}
                    />
                    <label htmlFor={'case_sensitive_search'} children={translate('SEARCH.CASE_SENSITIVE')} />
                </li>
                <li>
                    <input
                        type='checkbox'
                        id={'strict_character_search'}
                        onChange={store.setStrictCharacterSearch}
                        checked={store.strictCharacterSearch}
                    />
                    <label htmlFor={'strict_character_search'} children={translate('SEARCH.STRICT_CHARACTER')} />
                </li>
            </ul>
            <section className={classes.bookContainer}>
                <span
                    children={store.bookExpand ? <CollapseIcon /> : <ExpandIcon />}
                    className={classes.expandBtn}
                    onClick={store.setBookExpand}
                />
                <div className={classes.bookGroup}>
                    <h5>
                        <input
                            type='checkbox'
                            id={'old_testament_checkbox'}
                            onChange={store.onToggleOldTestament}
                            checked={store.allOldTestamentSelected}
                        />
                        <label
                            children={translate('TESTAMENT.OLD')}
                            htmlFor={'old_testament_checkbox'}
                        />
                    </h5>
                    <ul
                        className={classes.bookList}
                        style={{ display: store.bookExpand ? 'block' : 'none' }}
                    >
                        {store.oldTestamentBooks.map(book => (
                            <li key={book}>
                                <input
                                    type='checkbox'
                                    id={'add_bible_' + book}
                                    value={book}
                                    onChange={() => store.onToogleBooks([book])}
                                    checked={store.items.includes(book)}
                                />
                                <label
                                    htmlFor={'add_bible_' + book}
                                    children={app.baseBible.getBookName(book)}
                                    title={app.baseBible.getBookName(book)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={classes.bookGroup}>
                    <h5>
                        <input
                            type='checkbox'
                            id={'new_testament_checkbox'}
                            onChange={store.onToggleNewTestament}
                            checked={store.allNewTestamentSelected}
                        />
                        <label htmlFor={'new_testament_checkbox'} children={translate('TESTAMENT.NEW')} />
                    </h5>
                    <ul
                        className={classes.bookList}
                        style={{ display: store.bookExpand ? 'block' : 'none' }}
                    >
                        {store.newTestamentBooks.map(book => (
                            <li key={book}>
                                <input
                                    type='checkbox'
                                    id={'add_bible_' + book}
                                    value={book}
                                    onChange={() => store.onToogleBooks([book])}
                                    checked={store.items.includes(book)}
                                />
                                <label
                                    htmlFor={'add_bible_' + book}
                                    children={app.baseBible.getBookName(book)}
                                    title={app.baseBible.getBookName(book)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    ));
};
