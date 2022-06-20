import { Bible } from "../model/Bible";
import { IAvailableLanguage, ITranslation } from "./config";

export interface IChapterInfo {
    bookId: string;
    chapterId: number;
    title: string;
    disabled: boolean;
}

export interface IBible {
    id: string;
    lang: IAvailableLanguage;
    books: [string, number][];
    code: string;
    name: string;
    $oldTestament: { name: string, chapterCount: number }[];
    $newTestament: { name: string, chapterCount: number }[];
    isLoading: boolean;
    setIsLoading(status: boolean): void;
    currentBook: string;
    setCurrentBook(currentBook: string): void;
    currentChapter: number;
    setCurrentChapter(currentChapter?: number): void;
    currentVers: number;
    setCurrentVers(currentVers?: number): void
    limit: number;
    setLimit(limit?: number): void;
    getFootNoteInfo(rawFootNotes?: string[]): { id: string, text: string }[];
    getBookName(bookId?: string, shortName?: boolean): string;
    bookIndex: number;
    maxChapter: number;
    nextChapter: IChapterInfo;
    prevChapter: IChapterInfo;
    verses: IVers[];
}


export interface IVers {
    $bible?: Bible;
    $origin?: string;
    $contentFootnotes?: { id: string; text: string }[];
    $footNotes?: { id: string; text: string }[];
    content?: string;
    contentFootnotes?: string[];
    id: number;
    longId: string;
    footNotes?: string[];
    text: string;
}

export interface IArticle {
    id: string,
    title: string;
    content: string;
}

export interface IAbout {
    about: { text: string; }[],
    articles: IArticle[];
    changeLog: {
        text: string;
        date: string;
    }[];
}

export interface IOfflineData {
    about: Record<string, any>;
    bibles: Bible[];
    translations: ITranslation;
}

export interface IConfig {
    settings: {
        valami: any;
    },
    downloaded: {
        about: boolean;
        bibles: string[];
        languages: string[];
    }
}

export type IConfigKey = keyof IConfig;
export type IConfigValue = any;

export interface ISidebarData {
    content: JSX.Element | null;
    title: string;
    width?: number | string;
}
