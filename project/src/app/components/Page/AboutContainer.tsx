import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';

import { AppContext } from '@/app/core/AppProvider';
import { observer } from 'mobx-react-lite';
import { translate } from '@/app/core/app';

const useStyle = makeStyles({
    root: {
        '& main > section': {
            paddingTop: 24,
            '& h3': {
                paddingBottom: 8,
                textDecoration: 'underline',
                fontSize: 28
            }
        },
    },
    aboutSection: {
        textAlign: 'center',
        fontSize: 16,
        '& li': {
            lineHeight: '28px',
            '&:last-child': {
                paddingTop: 6
            }
        }
    },
    articleSection: {
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
    changeLogSection: {
        textAlign: 'center',
        '& ul': {
            display: 'inline-block',
            textAlign: 'left'
        },
        '& li': {
            fontSize: 12,
            fontWeight: 'bold',
            lineHeight: '18px',
            '& span:first-child': {
                color: 'blue',
                fontWeight: 'bold'
            }
        }
    }
});

export const AboutContainer = observer(() => {
    const globalStore = useContext(AppContext);
    const { navigate, about: { changeLog, articles, about } } = globalStore;
    const classes = useStyle();
    return (
        <section className={classes.root}>
            <main>
                <section className={classes.aboutSection}>
                    <h3>{translate('ABOUT.ABOUT')}</h3>
                    <ul>
                        {about.map(({ text }, idx) => (
                            <li key={idx}>
                                <span dangerouslySetInnerHTML={{ __html: text }} />
                            </li>
                        ))}
                    </ul>
                </section>
                <section className={classes.articleSection}>
                    <h3>{translate('ABOUT.ARTICLES')}</h3>
                    <ul>
                        {articles.map(({ id, title }, idx) => (
                            <li key={idx}>
                                <span onClick={() => navigate(`/article?id=${id}`)}>{title}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className={classes.changeLogSection}>
                    <h3>{translate('ABOUT.CHANGELOG')}</h3>
                    <ul>
                        {changeLog.reverse().map(({ text, date }, idx) => (
                            <li key={idx}>
                                <span>{date}</span> - <span dangerouslySetInnerHTML={{ __html: text }} />
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </section>
    );
});
