import React from 'react';

import { App } from '@/app/core/app';
import { action, computed, makeObservable, observable } from 'mobx';
import { SearchQueryParams } from '@gyozelem/bible/base-backend';

export class SearchStore {

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
    public setSearchTerm(searchTerm: string) { this.searchTerm = searchTerm; }
    public onSearchHandler(e: React.ChangeEvent<HTMLInputElement>) { this.setSearchTerm(e.currentTarget.value); }

    public onSubmit = () => {
        if (!this.searchTerm || !this.items.length) { return; }
        const data: SearchQueryParams = {
            bibleId: this.app.baseBible.id,
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
        this.app.navigate(relativeUrl);
        this.app.bibleService.search(data);
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
        const { bibleService } = this.app;
        if (bibleService.store.searchLoading) { return; }
        const params: Record<string, string> = {};
        const currentUrl = new URL(location.href);
        const searchParamEntries = [...currentUrl.searchParams.entries()];
        searchParamEntries.forEach(([key, value]) => params[key] = value);
        if (Object.keys(params).length === 0) { return; }
        const searchParams = {
            bibleId: this.app.baseBible.id,
            books: params.books.split('-'),
            caseSensitive: Boolean(params.caseSensitive),
            searchTerm: params.searchTerm,
            strictCharacters: Boolean(params.strictCharacters),
            wordMatchType: params.wordMatchType as SearchQueryParams['wordMatchType']
        };
        bibleService.search(searchParams);
        this.setSearchTerm(params.searchTerm || '');
    }

    constructor(public app: App) {
        makeObservable(this);
        const { baseBible } = app;
        this.bookIds = baseBible.books.map(x => x[0]);
        this.setItems(this.bookIds);
        this.oldTestamentBooks = baseBible.$oldTestament.map(x => x.name);
        this.newTestamentBooks = baseBible.$newTestament.map(x => x.name);
        this.init();
    }
}