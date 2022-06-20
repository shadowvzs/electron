import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';

import { AppContext } from '@/app/core/AppProvider';
import { observer } from 'mobx-react-lite';
import { translate } from '@/app/core/app';
import { action, makeObservable, observable } from 'mobx';
import { IArticle } from '@/app/interfaces/models';

const useStyle = makeStyles({
    root: {
        maxWidth: 700,
        margin: 'auto'
    },
    articlesSection: {
        textAlign: 'center',
        '& ul': {
            display: 'inline-block',
            textAlign: 'left'
        },
        '& li': {
            fontSize: 18,
            fontWeight: 'bold',
            lineHeight: '28px',
            '& span:first-child': {
                color: 'blue',
                cursor: 'pointer',
                fontWeight: 'bold'
            }
        }
    },
    articleSection: {
        padding: 16,
        '& p': {
            paddingTop: 16
        }
    }
});

class ArticleStore {

    @observable
    public article?: IArticle;

    @action.bound
    public setArticle(article?: IArticle) { this.article = article; }

    constructor(articles: IArticle[]) {
        makeObservable(this);
        const currentUrl = new URL(location.href);
        const articleId = currentUrl.searchParams.get('id');
        this.article = articles.find(x => x.id === articleId);
    }
}

export const ArticleContainer = observer(() => {
    const globalStore = useContext(AppContext);
    const { navigate, about: { articles } } = globalStore;
    const store = React.useState<ArticleStore>(() => new ArticleStore(articles))[0];
    const classes = useStyle();
    return (
        <section className={classes.root}>
            <main>
                {!store.article && (
                    <>
                        <h3>{translate('ABOUT.ARTICLES')}</h3>
                        <ul className={classes.articlesSection}>
                            {articles.map(({ id, title }, idx) => (
                                <li key={idx}>
                                    <span onClick={() => navigate(`/article?id=${id}`)}>{title}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {store.article && (
                    <article className={classes.articleSection}>
                        <h2>{store.article.title}</h2>
                        <p dangerouslySetInnerHTML={{ __html: store.article.content }} />
                    </article>
                )}
            </main>
        </section>
    );
});

// const currentUrl = new URL(location.href);
// currentUrl.searchParams.forEach((key, value) => params[key] = value);