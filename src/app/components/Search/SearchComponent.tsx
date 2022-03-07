import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { GlobalStore, translate } from '@/app/global/GlobalStore';
import { action, computed, makeObservable, observable } from 'mobx';
import { CollapseIcon } from '../icons/CollapseIcon';
import { ExpandIcon } from '../icons/ExpandIcon';
import { useObserver } from 'mobx-react-lite';
import { SearchQueryParams } from 'npm/@gyozelem/bible/base-backend';
import { AppContext } from '@/app/global/AppProvider';

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

class SearchStore {

    public $avalaibleWordMatchTypes = ['WHOLE_WORD', 'START_WITH', 'END_WITH', 'PART_WORD'];
    public bookIds: string[] = [];
    public oldTestamentBooks: string[] = [];
    public newTestamentBooks: string[] = [];

    @observable
    public bookExpand: boolean = false;

    @action.bound
    public setBookExpand() { this.bookExpand = !this.bookExpand; }

    @observable
    public items: string[] = [];

    @action.bound
    public setItems(items: string[]) { this.items = items; }

    @observable
    public wordMatchType: SearchQueryParams['wordMatchType'] = 'WHOLE_WORD';

    @action.bound
    public setWordMatchType(e: React.ChangeEvent<HTMLSelectElement>) { 
        this.wordMatchType = e.currentTarget.value as SearchQueryParams['wordMatchType']; 
    }

    @observable
    public strictCharacterSearch: boolean = false;

    @action.bound
    public setStrictCharacterSearch() { this.strictCharacterSearch = !this.strictCharacterSearch; }

    @observable
    public caseSensitiveSearch: boolean = false;

    @action.bound
    public setCaseSensitiveSearch() { this.caseSensitiveSearch = !this.caseSensitiveSearch; }

    @observable
    public searchTerm: string = '';

    @action.bound
    public setSearchTerm(e: React.ChangeEvent<HTMLInputElement>) { this.searchTerm = e.currentTarget.value; }

    public onSubmit = () => {
        if (!this.searchTerm || !this.items.length) { return; }
        const data: SearchQueryParams = {
            bibleId: this.globalStore.baseBible.id,
            books: this.items,
            caseSensitive: this.caseSensitiveSearch,
            searchTerm: this.searchTerm,
            strictCharacters: this.strictCharacterSearch,
            wordMatchType: this.wordMatchType
        };

        const url = new URL(`${location.protocol}//${location.host}/search`);
        url.searchParams.set('searchTerm', this.searchTerm);
        url.searchParams.set('caseSensitive', this.caseSensitiveSearch.toString());
        url.searchParams.set('strictCharacters', this.strictCharacterSearch.toString());
        url.searchParams.set('wordMatchType', this.wordMatchType);
        url.searchParams.set('books', this.items.join('-'));
        const relativeUrl = url.toString().substr(url.toString().indexOf('/search'));
        this.globalStore.navigate(relativeUrl);
        this.globalStore.bibleService.search(data);
    }

    public onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { this.onSubmit(); }
    }

    @computed
    public get allOldTestamentSelected() { 
        return this.oldTestamentBooks.every(x => this.items.includes(x)); 
    }

    @computed
    public get allNewTestamentSelected() { 
        return this.newTestamentBooks.every(x => this.items.includes(x)); 
    }

    public onToggleOldTestament = () => this.onToogleBooks(this.oldTestamentBooks);
    public onToggleNewTestament = () => this.onToogleBooks(this.newTestamentBooks);

    @action.bound
    public onToogleBooks(bibleIds: string[]) {
        let items = this.items;
        const isSelected = bibleIds.every(x => items.includes(x));
        if (isSelected) {
            items = items.filter(x => !bibleIds.includes(x));
        } else {
            items = [...new Set([...items, ...bibleIds])];
        }
        this.setItems(items);
    };

    private init() {
        const { bibleService } = this.globalStore;
        if (bibleService.store.searchLoading) { return; }
        const params: Record<string, string> = {};
        const currentUrl = new URL(location.href);
        currentUrl.searchParams.forEach((key, value) => params[key] = value);
        if (Object.keys(params).length === 0) { return; }
        const searchParams = {
            bibleId: this.globalStore.baseBible.id,
            books: params.books.split('-'),
            caseSensitive: Boolean(params.caseSensitive),
            searchTerm: params.searchTerm,
            strictCharacters: Boolean(params.strictCharacters),
            wordMatchType: params.wordMatchType as SearchQueryParams['wordMatchType']
        };
        bibleService.search(searchParams);
    }

    constructor(public globalStore: GlobalStore) {
        makeObservable(this);
        const { baseBible } = globalStore;
        this.bookIds = baseBible.books.map(x => x[0]);
        this.setItems(this.bookIds);
        this.oldTestamentBooks = baseBible.$oldTestament.map(x => x.name);
        this.newTestamentBooks = baseBible.$newTestament.map(x => x.name);
        this.init();
    }
}

export const SearchComponent = () => {
    const globalStore = useContext(AppContext);
    const store = React.useState(() => new SearchStore(globalStore))[0];
    const classes = useStyle();

    return useObserver(() => (
        <div className={classes.root}>
            <ul className={classes.inputList}>
                <li style={{ paddingBottom: 8 }}>
                    <input 
                        type='text' 
                        onChange={store.setSearchTerm}
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
                                    id={'add_bible_'+book} 
                                    value={book} 
                                    onChange={() => store.onToogleBooks([book])}
                                    checked={store.items.includes(book)}
                                />
                                <label 
                                    htmlFor={'add_bible_'+book} 
                                    children={globalStore.baseBible.getBookName(book)} 
                                    title={globalStore.baseBible.getBookName(book)} 
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
                                    id={'add_bible_'+book} 
                                    value={book} 
                                    onChange={() => store.onToogleBooks([book])}
                                    checked={store.items.includes(book)}
                                />
                                <label 
                                    htmlFor={'add_bible_'+book} 
                                    children={globalStore.baseBible.getBookName(book)} 
                                    title={globalStore.baseBible.getBookName(book)} 
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    ));
};
