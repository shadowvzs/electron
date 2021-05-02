import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';

import { AppContext } from '@/app/global/AppProvider';
import { translate } from '@/app/global/GlobalStore';

const useStyle = makeStyles({
    bookContainer: {
        position: 'relative',
        padding: '40px 100px',
        textShadow: '1px 1px 2px #bbb',
        textAlign: 'center',
        '& main': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            '& > div': {
                paddingTop: 16,
                textAlign: 'left',
            },
            '& nav': {
                color: '#0000EE',
                cursor: 'pointer'
            }
        },
        '& h2': {
            paddingBottom: 4,
            textDecoration: 'underline'
        }
    }
});

export const BookContainer = observer(() => {
    const { baseBible } = useContext(AppContext);
    const { setCurrentBook } = baseBible;
    const classes = useStyle();

    return (
        <section className={classes.bookContainer}>
            <h1 onClick={() => baseBible.setCurrentBook('')}>{baseBible.name}</h1>
            <main>
                <div>
                    <h2>{translate('TESTAMENT.OLD')}</h2>
                    {baseBible.$oldTestament.map(book => (
                        <nav 
                            key={book.name}
                            onClick={() => setCurrentBook(book.name)}
                        >
                            {baseBible.getBookName(book.name)}
                        </nav>
                    ))}
                </div>
                <div>
                    <h2>{translate('TESTAMENT.NEW')}</h2>
                    {baseBible.$newTestament.map(book => (
                        <nav 
                            key={book.name}
                            onClick={() => setCurrentBook(book.name)}
                        >
                            {baseBible.getBookName(book.name)}
                        </nav>
                    ))}
                </div>
            </main>
        </section>
    );
});
