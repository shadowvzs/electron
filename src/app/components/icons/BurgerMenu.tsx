import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import cn from '@gyozelem/utility/classnames';
import { makeStyles } from '@mui/styles';

import { AppContext } from '@/app/global/AppProvider';
import { translate } from '@/app/core/app';

const useStyle = makeStyles({
    rootContainer: {
        position: 'absolute',
        right: 1,
        '&.active': {
            left: 1,
        }
    },
    root: {
        position: 'absolute',
        top: 35,
        right: 10,
        display: 'block',
        width: 32,
        height: 32,
        margin: '-30px auto 0 auto',
        cursor: 'pointer',
        '& div': {
            position: 'relative',
            top: 0,
            height: 5,
            backgroundColor: 'rgba(0,0,0,0.8)',
            marginBottom: 8,
            transition: '0.3s ease',
            borderRadius: 2,
            zIndex: 1,
            '&:first-child': {
                transformOrigin: 0
            },
            '&:last-child': {
                marginBottom: 0,
                transformOrigin: 60
            },
            '&:nth-child(2)': {
                right: 0,
                width: 32
            }
        },
        '&.active': {
            '& div': {
                backgroundColor: 'rgba(255,0,0,0.8)',
                '&:first-child': {
                    transform: 'rotateZ(42deg)',
                    width: 38
                },
                '&:last-child': {
                    transformOrigin: 0,
                    transform: 'rotateZ(-42deg)',
                    width: 38
                },
                '&:nth-child(2)': {
                    transform: 'rotateZ(360deg)',
                    transformOrigin: 50,
                    opacity: 0,
                    width: 30
                }
            }
        },
    },
    listContainer: {
        maxWidth: 0,
        overflow: 'hidden',
        transition: '0.3s ease',
        backgroundColor: 'white',
        '&.active': {
            maxWidth: '100%',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: 8
        }
    },
    list: {
        transform: 'translateX(-100%)',
        padding: '32px 16px 16px 16px',
        transitionDelay: '0.3s',
        transition: '0.4s ease',
        '&.active': {
            transform: 'translateX(0)',
        },
        '& li': {
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItem: 'center',
            padding: '2px 8px',
            lineHeight: '24px',
            '& img': {
                margin: '0 2px',
                '&:first-child': {
                    margin: '0 10px',
                }
            }
        }
    },
    listHeader: {
        transitionDelay: '0.3s',
        transition: '0.4s ease',
        transform: 'translate(12px, -1.2em)',
        '&.active': {
            transform: 'translate(12px, 12px)'
        }
    }
});

export const BurgerMenu = observer(() => {
    const [active, setActive] = React.useState(false);
    const { availableLanguages, currentLanguage, navigate, setCurrentLanguage } = useContext(AppContext);
    const classes = useStyle();
    return (
        <section className={cn(classes.rootContainer, active && 'active')}>
            <header>
                <label className={cn(classes.root, active && 'active')} onClick={() => setActive(!active)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </label>
            </header>
            <main className={cn(classes.listContainer, active && 'active')}>
                <header className={cn(classes.listHeader, active && 'active')}><h3>{translate('MENU')}</h3></header>
                <ul className={cn(classes.list, active && 'active')}>
                    <li>
                        <img
                            src={`assets/icons/${currentLanguage}.png`}
                            width={24}
                            height={24}
                        />
                        <p>{translate('LANGUAGE')}:</p>
                        {availableLanguages.map(x => (
                            <span key={x}>
                                <img
                                    className='clickable'
                                    src={`assets/icons/${x}.png`}
                                    width={24}
                                    height={24}
                                    onClick={() => setCurrentLanguage(x)}
                                    style={{ boxShadow: currentLanguage === x ? '0 0 3px 3px rgba(0,0,0,0.25)' : undefined }}
                                />
                            </span>
                        ))}
                    </li>
                    <li onClick={() => navigate('/search')} className='clickable'>
                        <img src="assets/icons/set.png" width="24" height="24" />
                        <span>{translate('SETTINGS.SETTINGS')}</span>
                    </li>
                    <li onClick={() => navigate('/search')} className='clickable'>
                        <img src="assets/icons/find.png" width="24" height="24" />
                        <span>{translate('SETTINGS.SEARCH')}</span>
                    </li>
                    <li onClick={() => navigate('/about')} className='clickable'>
                        <img src="assets/icons/news1.png" id="news_img_icon" width="24" height="24" />
                        <span>{translate('SETTINGS.ABOUT')}</span>
                    </li>
                </ul>
            </main>
        </section>
    );
});