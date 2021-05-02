import { Bible, Vers } from "../models/Bible";

export abstract class BaseBibleRepository {

    public async getInstalledBibles(): Promise<Bible[]> {
        throw new Error('Method not implemented.');
    }

    public getBible(bibleId: string): Promise<Bible> {
       throw new Error('Method not implemented.');
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        throw new Error('Method not implemented.');
    }

    public rawFootNoteToObject(footNote: string) {
        return {
            bookIndex: parseInt(footNote.substr(0, 2)) - 1,
            bookId: '',
            chapterId: parseInt(footNote.substr(2, 3)),
            versId: parseInt(footNote.substr(5, 3)),
            length: parseInt(footNote.substr(7, 2))
        }

    }
  
    // public getChapter(bookId: string, chapterId: string): Promise<boolean> {
    //     throw new Error('Method not implemented.');
    // }

    // public getVerses(bookId: string, chapterId: string): Promise<Vers[]> {
    //     throw new Error('Method not implemented.');
    // }

    // public getFootnotes(versIds: string[]) {
    //    throw new Error('Method not implemented.');
    // }
}