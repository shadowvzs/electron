import express from "express";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";
import { aboutData } from "./About";
import { Backend } from "./Backend";

const app = express();
const bodyParser = require('body-parser');
const port = 3333;

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// url rewrite cases
app.use(function(req, res, next) {
    const url = req.url;
    if (!url.includes('/api/')) {
        if (url.includes('/search')) { 
            req.url = req.url.replace('/search', '/').replace('//', '/');
        } else if (url.includes('/about')) {
            req.url = req.url.replace('/about', '/').replace('//', '/');
        } else if (url.includes('/article')) {
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

app.use(express.static('../dist'));

const api = new Backend('..');

app.get('/api/get-bible', async (req, res) => {
    // api.getBible(null, {});
    res.send();
});

app.get('/api/get-installed-bibles', async (req, res) => {
    const bibles = api.getInstalledBibles();
    res.send(bibles);
});

app.get('/api/get-chapter-verses', (req, res) => {
    const { bibleId, bookId, chapterId } = req.query;
    const bibles = api.getChapterVerses(null, { 
        bibleId: bibleId as string, 
        bookId: bookId as string, 
        chapterId: parseInt(chapterId as string) 
    });
    res.send(bibles);
});

app.get('/api/get-bible-book/:bibleId/:bookId', (req, res) => {
    const { bibleId, bookId } = req.params;
    const bible = api.getBible(null, { bibleId });
    const bookData = bible.books.find(x => x[0].toUpperCase() === bookId.toUpperCase())!;

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
    const data: SearchQueryParams = req.body;
    const result = api.search(data);
    res.send(result);
});

app.get('/api/about', (req, res) => {
    res.send(aboutData);
});

app.listen(port, () => {
    console.log(`Application listening on port ${port}!`);
});