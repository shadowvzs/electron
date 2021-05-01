import { action, makeObservable, observable, runInAction, transaction } from "mobx";
import { translate } from "../global/GlobalStore";
import { BaseBibleRepository } from "../services/BaseBibleRepository";
import { IAvailableLanguage } from "../services/BaseTranslatorRepository";

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

        return this.bibleService.getChapterVerses(this.id, this.currentBook, currentChapter)
            .then(verses => {
                runInAction(() => {
                    this.verses = verses;
                    this.currentChapter = currentChapter;
                })
            });
    }

    public getFootNoteInfo(rawFootNotes: string[]) {

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

        info.title = translate(`BOOKS.${info.bookId}.NAME`, {}, this.lang) + ` ${info.chapterId}`;

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

        info.title = translate(`BOOKS.${info.bookId}.NAME`, {}, this.lang) + ` ${info.chapterId}`;

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
    id: number;
    footNotes?: string[];
    text: string;
}
