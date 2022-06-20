import { SearchContainer } from '../components/Page/SearchContainer';
import { BibleContainer } from '../components/Page/BibleContainer';
import { AboutContainer } from '../components/Page/AboutContainer';
import { ArticleContainer } from '../components/Page/ArticleContainer';
import { app } from '../core/app';

export const routeMap = [
    {
        path: '/search',
        beforeRender: () => {
            app.navigateTo({ bibleId: app.getCurrentBible().id });
            return true;
        },
        renderCmp: SearchContainer,
    },
    {
        path: '/article',
        beforeRender: () => {
            app.navigateTo({ bibleId: app.getCurrentBible().id });
            return true;
        },
        renderCmp: ArticleContainer,
    },
    {
        path: '/about',
        beforeRender: () => {
            app.navigateTo({ bibleId: app.getCurrentBible().id });
            return true;
        },
        renderCmp: AboutContainer,
    },
    {
        path: '/',
        beforeRender: () => {
            const params = app.extractBibleUrlParams(location.href);
            app.navigateTo(params);
            return true;
        },
        renderCmp: BibleContainer,
    },
];
