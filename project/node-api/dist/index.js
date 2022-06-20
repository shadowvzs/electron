"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const About_1 = require("./About");
const Backend_1 = require("./Backend");
const app = express_1.default();
const bodyParser = require('body-parser');
const port = 3333;
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    const url = req.url;
    if (!url.includes('/api/')) {
        if (url.includes('/search')) {
            req.url = req.url.replace('/search', '/').replace('//', '/');
        }
        else if (url.includes('/about')) {
            req.url = req.url.replace('/about', '/').replace('//', '/');
        }
        else if (url.includes('/article')) {
            req.url = req.url.replace('/article', '/').replace('//', '/');
        }
    }
    if (url.includes('/sw/') && url.includes('.js')) {
        res.setHeader('service-worker-allowed', '/');
        res.setHeader('service-worker', 'script');
    }
    console.log(req.url);
    next();
});
app.use(express_1.default.static('../dist'));
const api = new Backend_1.Backend('..');
app.get('/api/get-bible', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send();
}));
app.get('/api/get-installed-bibles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bibles = api.getInstalledBibles();
    res.send(bibles);
}));
app.get('/api/get-chapter-verses', (req, res) => {
    const { bibleId, bookId, chapterId } = req.query;
    const bibles = api.getChapterVerses(null, {
        bibleId: bibleId,
        bookId: bookId,
        chapterId: parseInt(chapterId)
    });
    res.send(bibles);
});
app.get('/api/get-bible-book/:bibleId/:bookId', (req, res) => {
    const { bibleId, bookId } = req.params;
    const bible = api.getBible(null, { bibleId });
    const bookData = bible.books.find(x => x[0].toUpperCase() === bookId.toUpperCase());
    const book = [];
    for (let i = 1; i <= bookData[1]; i++) {
        book.push(api.getChapterVerses(null, {
            bibleId: bibleId,
            bookId: bookId.toUpperCase(),
            chapterId: i
        }));
    }
    res.send(book);
});
app.post('/api/get-footnotes/:bibleId', (req, res) => {
    const footNotes = api.getFootNotes(null, { bibleId: req.params.bibleId, footNoteObjs: req.body });
    res.send(footNotes);
});
app.get('/api/get-translations', (req, res) => {
    const translations = api.getTranslations();
    res.send(translations);
});
app.post('/api/search', (req, res) => {
    const data = req.body;
    const result = api.search(data);
    res.send(result);
});
app.get('/api/about', (req, res) => {
    res.send(About_1.aboutData);
});
app.listen(port, () => {
    console.log(`Application listening on port ${port}!`);
});
