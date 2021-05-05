import { action, makeObservable, observable, runInAction } from "mobx";

import { translate } from "../app/global/GlobalStore";
import { BaseBibleRepository } from "../app/services/BaseBibleRepository";
import { IAvailableLanguage } from "../app/services/BaseTranslatorRepository";

export class Bible {
    public id: string;
    public lang: IAvailableLanguage;
    public books: [string, number][] = [];
    public code: string;
    public name: string;

    private get matthewIdx(): number {
        return this.books.findIndex(x => x[0] === 'MAT');
    }

    public get $oldTestament() {
        return this.books.slice(0, this.matthewIdx).map(([name, chapterCounr]) => ({ name, chapterCounr }));
    }

    public get $newTestament() {
        return this.books.slice(this.matthewIdx).map(([name, chapterCounr]) => ({ name, chapterCounr }));
    }

    @observable
    public isLoading: boolean = false;
    
    @action.bound
    public setIsLoading(status: boolean) {
        this.isLoading = status;
    }

    @observable
    public currentBook: string = '';

    @action.bound
    public setCurrentBook(currentBook: string) { 
        this.currentBook = currentBook; 
        this.setCurrentChapter();
    }

    @observable
    public currentChapter: number = 0;

    @action.bound
    public setCurrentChapter(currentChapter?: number) { 
        if (!currentChapter) {
            this.verses = [];
            this.currentChapter = 0;
            return;
        }

        this.setIsLoading(true);
        return this.bibleService.getChapterVerses(this.id, this.currentBook, currentChapter)
            .then(verses => {
                runInAction(() => {
                    this.verses = verses;
                    this.currentChapter = currentChapter;
                })
            })
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    public getFootNoteInfo(rawFootNotes?: string[]): { id: string, text: string }[] {
        if (!rawFootNotes || rawFootNotes.length === 0) {
            return [];
        }
        const footNotes = rawFootNotes.map(rawFootNote => {
            const obj = this.bibleService.rawFootNoteToObject(rawFootNote);
            const bookId = this.books[obj.bookIndex][0];
            return {
                id: rawFootNote,
                text: `${this.getBookName(bookId, true)} ${obj.chapterId}:${obj.versId}-${obj.versId + obj.length}`
            };
        });

        if (footNotes.length > 1) {
            footNotes.push({
                id: 'all',
                text: `[${translate('ALL').toUpperCase()}]`
            });
        }

        return footNotes;
    }

    public getBookName(bookId?: string, shortName?: boolean) {
        return translate(`BOOKS.${bookId || this.currentBook}.${shortName ? 'SHORT_NAME' : 'NAME'}`, {}, this.lang);
    }

    public get bookIndex(): number {
        return this.books.findIndex(x => x[0] === this.currentBook);
    }

    public get maxChapter(): number {
        return this.books[this.bookIndex][1];
    }

    public get nextChapter () {
        const info = {
            bookId: this.currentBook,
            chapterId: this.currentChapter,
            title: 'no more',
            disabled: false
        }

        if (this.currentBook === 'REV' && this.currentChapter === 22) {
            info.disabled = true;
            return info;
        }

        if (info.chapterId === this.maxChapter) {
            info.bookId = this.books[this.bookIndex + 1][0];
            info.chapterId = 1;
        } else {
            info.chapterId++;
        }

        info.title = `${this.getBookName(info.bookId)} ${info.chapterId}`;

        return info;
    }

    public get prevChapter () {
        const info = {
            bookId: this.currentBook,
            chapterId: this.currentChapter,
            title: 'no more',
            disabled: false
        }

        if (this.currentBook === 'GEN' && this.currentChapter === 1) {
            info.disabled = true;
            return info;
        }

        if (info.chapterId === 1) {
            const prevbook = this.books[this.bookIndex - 1];
            info.bookId = prevbook[0];
            info.chapterId = prevbook[1];
        } else {
            info.chapterId--;
        }

        info.title = `${this.getBookName(info.bookId)} ${info.chapterId}`;

        return info;
    }

    constructor(
        public bibleService: BaseBibleRepository
    ) {
        makeObservable(this)
    }

    public verses: Vers[];
}

// export class Book {
//     public id: number;
//     public bibleId: string;
//     public index: number;
//     public name: string;
//     public chapters: Chapter[] = [];

//     // public get $name(): string {
//     //     return this.name;
//     // }
//     public $bible: Bible;
// }

// export class Chapter {
//     public id: number;
//     public index: number;
//     public bookId: string;
//     public chapterCount: number;

//     public $book: Book;
// }

export interface Vers {
    $origin?: string;
    content?: string;
    contentFootnotes?: string[];
    $contentFootnotes?: { id: string; text: string }[];
    id: number;
    footNotes?: string[];
    $footNotes?: { id: string; text: string }[];
    text: string;
}
