const fs = require('fs');
const { performance } = require('perf_hooks');

class BaseBackend {

    constructor(basePath) {
        this.basePath = basePath;
        this.chapterCache = {};
        this.getBibleRoot = () => `${this.basePath}/bibles/`;
        this.getBibleDetailPath = (id) => `${this.basePath}/bibles/${id}/index.json`;
        this.getLocaleRoot = () => `${this.basePath}/assets/locale/`;
        this.getLocale = (name) => `${this.basePath}/assets/locale/${name}`;
        this.getTranslations = this.getTranslations.bind(this);
        this.getInstalledBibles = this.getInstalledBibles.bind(this);
        this.getBible = this.getBible.bind(this);
        this.getChapterVerses = this.getChapterVerses.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    
    destroy() {
       // clean up if needed
    }

    getTranslations(event) {
        const translations = fs.readdirSync(this.getLocaleRoot(), { withFileTypes: true })
            .filter((file) => file.name.endsWith('.json'))
            .reduce((t, file) => {
                const lang = file.name.split('.')[0];
                t[lang] = JSON.parse(fs.readFileSync(this.getLocale(file.name), 'utf8'));
                return t;
            }, {});
        return translations;
    }

    getInstalledBibles(event) {
        const bibles = fs.readdirSync(this.getBibleRoot(), { withFileTypes: true })
            .filter((file) => file.isDirectory())
            .map((file) => this.getBible(null, { bibleId: file.name }));
        return bibles;
    }

    getBible(event, bibleQueryParams) {
        const rawdata = fs.readFileSync(this.getBibleDetailPath(bibleQueryParams.bibleId));
        return JSON.parse(rawdata);
    }

    getChapterVerses(event, bibleQueryParams) {
        const key = JSON.stringify(bibleQueryParams);
        if (this.chapterCache[key]) { return this.chapterCache[key]; }
        const verses = getChapterVerses(bibleQueryParams, this.basePath);
        return verses;
    }
}

function getChapterVerses({ bibleId, bookId, chapterId }, basePath = '') {

    const t1 = performance.now();
    const path = basePath + `/bibles/${bibleId}/data/${bookId}/${chapterId}.txt`;
    if (!fs.existsSync(path)) {  throw new Error('Not found'); }

    const chapter = [];
    let vers = {};

    fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line, index) {
        if (line.length === 0) { return; }
        const firstChar = line[0];
        if (firstChar === "!") {
            const rawContent = line.substr(1).split('*');
            const footNotes = rawContent[1] && rawContent[1].split('#').slice(1) || [];
            vers = { 
                content: rawContent[0], 
                contentFootnotes: footNotes
            };
        } else if (!isNaN(parseInt(line))) {
            if (index > 0) { vers.id = parseInt(line); }
        } else if (firstChar === '#') {
            vers.footNotes = line.substr(1).split('#');
        } else {
            vers.text = line;
            chapter.push(vers);
            vers = {};
        }
    });

    const t2 = performance.now();
    console.log(`it was ${(t2 - t1)/1000}s`);

    return chapter;
}

module.exports = { BaseBackend, getChapterVerses }
