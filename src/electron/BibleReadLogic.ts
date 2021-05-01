import { Vers } from "@/app/models/Bible";

const { performance } = require('perf_hooks');
const fs = require('fs');

export interface BibleQueryParams {
    bibleId: string;
    bookId: string;
    chapterId: number;
    versId: number;
    versLimit: number;
}

export function getChapterVerses({ bibleId, bookId, chapterId }: Pick<BibleQueryParams, 'bibleId' | 'bookId' | 'chapterId'>, basePath: string = ''): Vers[] {

    const t1 = performance.now();
    const path = basePath + `/bibles/${bibleId}/data/${bookId}/${chapterId}.txt`;
    if (!fs.existsSync(path)) {  throw new Error('Not found'); }

    const chapter: Vers[] = [];
    let vers: Vers = {} as Vers;

    fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line: string, index: number) {
        if (line.length === 0) { return; }
        const firstChar = line[0];
        if (firstChar === "!") {
            const rawContent = line.substr(1).split('*');
            const footNotes = rawContent[1] && rawContent[1].split('#') || [];
            vers = { 
                content: rawContent[0], 
                contentFootnotes: footNotes
            } as Vers;
        } else if (!isNaN(parseInt(line))) {
            if (index > 0) { vers.id = parseInt(line); }
        } else if (firstChar === '#') {
            vers.footNotes = line.substr(1).split('#');
        } else {
            vers.text = line;
            chapter.push(vers);
            vers = {} as Vers;
        }
    });

    const t2 = performance.now();
    console.log(`it was ${(t2 - t1)/1000}s`);

    return chapter;
}
