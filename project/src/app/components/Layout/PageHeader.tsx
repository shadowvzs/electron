import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import cn from '@gyozelem/utility/classnames';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/core/AppProvider';
import { translate } from '@/app/core/app';
import { BurgerMenu } from '../icons/BurgerMenu';
import { openSettings } from '../Modal/SettingsModal';

const useStyle = makeStyles({
    root: {
        position: 'absolute',
        top: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    bookBox: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingTop: 8,
        '& > li': {
            cursor: 'pointer',
            width: 250,
            margin: '0 2px',
            '& > span': {
                textAlign: 'center',
                lineHeight: '14px',
                fontWeight: 'bold',
                width: '100%',
                fontSize: 18,
                display: 'block',
                padding: '5px 10px',
                border: '1px solid #ddd',
                background: 'linear-gradient(top, #fff 0%, #e2e2e2 100%)',
                filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#fff", endColorstr="#e2e2e2",GradientType=0)',
                color: '#333',
                boxShadow: '3px 3px 6px rgba(0,0,0,0.40)',
                margin: '0px 5px',
                textShadow: '1px 1px 1px #dddddd',
            },
            '& > ul': {
                display: 'none',
                '& > li': {
                    position: 'relative',
                    fontSize: 17,
                    lineHeight: '6px',
                    top: 6,
                    left: 6,
                    opacity: .97,
                    backgroundColor: '#fff',
                    boxShadow: '3px 3px 6px rgba(0,0,0,0.30)',
                    color: '#777',
                    padding: '5px 10px',
                    transition: '0.3s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '& a': {
                        textDecoration: 'none',
                        color: 'inherit'
                    },
                    '&:first-child': {
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    },
                    '&:last-child': {
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                    },
                    '&:hover': {
                        background: 'linear-gradient(top, #fdfdfd 0%, #eee 100%)',
                        color: '#000',
                        left: 12,
                    }
                }
            },
            '&:hover > ul': {
                display: 'block',
            }
        },
        '&.mobile > li': {
            width: 160
        }
    },
    languageBox: {},
    toolbarBox: {},
    headerBox: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        lineHeight: '22px',
        borderBottomRightRadius: '25px 50px',
        borderBottomLeftRadius: '25px 50px',
        padding: '8px 16px 16px 16px',
        height: 45,
        border: '1px solid #ddd',
        boxShadow: '5px 5px 3px rgba(0,0,0,0.1)',
        background: 'linear-gradient(top, #ddd 0%, #fff 100%)',
        filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#ddd", endColorstr="#fff",GradientType=0)',
        '& > div': {
            padding: ' 0 6px'
        },
        '& img': {
            border: 0,
            borderRadius: 4,
            transition: '0.3s',
            '&:hover': {
                transform: 'scale(1.2, 1.2)',
                cursor: 'pointer'
            }
        }
    },
});

export const PageHeader = observer(() => {
    const app = useContext(AppContext);
    const isMobile = app.isMobile;
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <BibleBookMenu />
            {isMobile && <BurgerMenu />}
            {!isMobile && <LanguageSelect />}
            {!isMobile && <ToolbarMenu />}
        </div>
    );
});

export const BibleBookMenu = observer(() => {
    const { baseBible, isMobile, navigate } = useContext(AppContext);
    const classes = useStyle();

    return (
        <ul className={cn(classes.bookBox, isMobile && 'mobile')}>
            <li>
                <span>{translate('TESTAMENT.OLD')} ▾</span>
                <ul>
                    {baseBible.$oldTestament.map(book => (
                        <li key={book.name} onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${book.name}`)}>
                            {baseBible.getBookName(book.name)}
                        </li>
                    ))}
                </ul>
            </li>
            <li>
                <span>{translate('TESTAMENT.NEW')} ▾</span>
                <ul>
                    {baseBible.$newTestament.map(book => (
                        <li key={book.name} onClick={() => navigate(`/?bibleId=${baseBible.id}&bookId=${book.name}`)}>
                            {baseBible.getBookName(book.name)}
                        </li>
                    ))}
                </ul>
            </li>
        </ul>
    );
});

export const ToolbarMenu = observer(() => {
    const classes = useStyle();
    const { navigate } = useContext(AppContext);
    return (
        <div className={cn(classes.headerBox, classes.toolbarBox)}>
            <div
                title={translate('SETTINGS.SETTINGS')}
                onClick={() => openSettings()}
            >
                <img src="assets/icons/set.png" width="24" height="24" />
            </div>

            <div
                title={translate('SETTINGS.SEARCH')}
                onClick={() => navigate('/search')}
            >
                <img src="assets/icons/find.png" width="24" height="24" />
            </div>

            <div
                title={translate('SETTINGS.ABOUT')}
                onClick={() => navigate('/about')}
            >
                <img src="assets/icons/news1.png" id="news_img_icon" width="24" height="24" />
            </div>
        </div>
    );
});

export const LanguageSelect = observer(() => {
    const { currentLanguage, setCurrentLanguage, availableLanguages } = useContext(AppContext);
    const classes = useStyle();
    return (
        <div className={cn(classes.headerBox, classes.languageBox)}>
            {availableLanguages.map(x => (
                <div key={x}>
                    <img
                        src={`assets/icons/${x}.png`}
                        width={24}
                        height={24}
                        onClick={() => setCurrentLanguage(x)}
                        style={{ boxShadow: currentLanguage === x ? '0 0 3px 3px rgba(0,0,0,0.25)' : undefined }}
                    />
                </div>
            ))}
        </div>
    );
});
