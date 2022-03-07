import { SearchContainer } from '../components/Page/SearchContainer';
import { BibleContainer } from '../components/Page/BibleContainer';
import { AboutContainer } from '../components/Page/AboutContainer';
import { ArticleContainer } from '../components/Page/ArticleContainer';
import { globalStore } from '../global/GlobalStore';

export const routeMap = [
    {
        path: '/search',
        beforeRender: () => {
            globalStore.navigateTo({ bibleId: globalStore.getCurrentBible().id });
            return true;
        },
        renderCmp: SearchContainer,
    },
    {
        path: '/article',
        beforeRender: () => {
            globalStore.navigateTo({ bibleId: globalStore.getCurrentBible().id });
            return true;
        },
        renderCmp: ArticleContainer,
    },
    {
        path: '/about',
        beforeRender: () => {
            globalStore.navigateTo({ bibleId: globalStore.getCurrentBible().id });
            return true;
        },
        renderCmp: AboutContainer,
    },
    {
        path: '/',
        beforeRender: () => {
            const params = globalStore.extractBibleUrlParams(location.href);
            globalStore.navigateTo(params);
            return true;
        },
        renderCmp: BibleContainer,
    },
];
