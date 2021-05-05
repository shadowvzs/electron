export interface BibleQueryParams {
    bibleId: string;
    bookId: string;
    chapterId: number;
    versId: number;
    versLimit: number;
}

export interface BaseVers {
    id: number;
    content: string; 
    contentFootnotes: string[];
    footNotes: string[];
    text: string;
}

interface IFile {
    name: string;
    isDirectory: () => boolean;
}

interface IBible {
    id: string;
    lang: string;
    books: [string, number][];
    code: string;
    name: string;
}

export declare class BaseBackend {
    chapterCache: Record<string, any>;
    getBibleRoot(): string;
    getBibleDetailPath(id: string): string;
    getLocaleRoot(): string;
    getLocale(name: string): string;

    constructor(basePath: string);
    destroy(): void;

    getTranslations(event?: unknown): Record<string, any>;
    getInstalledBibles(event?: unknown): IBible[];
    getBible(event: unknown, bibleQueryParams: Pick<BibleQueryParams, 'bibleId'>): IBible;
    getChapterVerses(event: unknown, bibleQueryParams: Pick<BibleQueryParams, 'bibleId' | 'bookId' | 'chapterId'>): BaseVers[];
}

export function getChapterVerses<T extends BaseVers>({ bibleId, bookId, chapterId }: Pick<BibleQueryParams, 'bibleId' | 'bookId' | 'chapterId'>, basePath: string): T[];
