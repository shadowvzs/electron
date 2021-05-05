import express from "express";
import path from "path";

import { Backend } from "./Backend";
const app = express();

var cors = require('cors');
app.use(cors());

app.use(express.static('../dist'));
console.log(__dirname);

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

app.get('/api/get-translations', (req, res) => {
    const translations = api.getTranslations();
    res.send(translations);
});

app.listen(3333, () => {
    console.log('Application listening on port 3333!');
});