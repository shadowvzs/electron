import React from 'react';
import { makeStyles } from '@mui/styles';
import { Bible } from '@/app/model/Bible';
import { VersItem } from '../Page/VersContainer';
import { translate } from '@/app/core/app';
import { ExpandIcon } from '../icons/ExpandIcon';
import { CollapseIcon } from '../icons/CollapseIcon';
import { IVers } from '@/app/interfaces/models';

const useStyle = makeStyles({
    listContainer: {
        position: 'relative',
        padding: 16,
        background: 'rgba(255,255,0,.1)',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        marginBottom: 6
    },
    listHeader: {
        position: 'relative',
        paddingTop: 12,
        paddingBottom: 4,
        fontSize: 18,
        color: '#005',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between'
    },
    expandBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        fontSize: 30,
        color: 'red',
        '& svg': {
            fill: 'white',
            stroke: 'rgba(0,0,0,0.5)',
            cursor: 'pointer'
        }
    },
});

interface FootNoteListProps {
    verses: IVers[];
    setFootNoteSidebar: (bible: Bible, id: string) => Promise<void>;
}

const getVersText = (verses: IVers[]) => {
    const [, book, chapter, vers1] = verses[0].longId.split('-');
    const [, , , vers2] = verses.slice(-1)[0].longId.split('-');
    const versText = verses.length > 1 ? (vers1 + '-' + vers2) : vers1;
    return translate(`BOOKS.${book}.SHORT_NAME`) + ` ${chapter}:${versText}`;
}

const EXPAND_WHEN = 1;
export const FootNoteList = ({ verses, setFootNoteSidebar }: FootNoteListProps) => {
    const classes = useStyle();
    const [open, onToggle] = React.useState<boolean>(false);

    const list = verses.map((v, idx) => (
        <VersItem
            key={idx + '_' + v.id}
            vers={v}
            setFootNoteSidebar={setFootNoteSidebar}
        />
    ));

    return (
        <section className={classes.listContainer}>
            <header className={classes.listHeader}>
                <span>{getVersText(verses)}</span>
                {verses.length > EXPAND_WHEN && (
                    <div
                        children={open ? <CollapseIcon style={{ height: 30 }} /> : <ExpandIcon style={{ height: 30 }} />}
                        className={classes.expandBtn}
                        onClick={() => onToggle(!open)}
                    />
                )}
            </header>
            <main>
                <span>{open ? list : list.splice(0, EXPAND_WHEN)}</span>
            </main>
        </section>
    );
};

export const renderFootNoteList = (versGroups: IVers[][], setFootNoteSidebar: (bible: Bible, id: string) => Promise<void>) => {
    return (
        <div style={{ position: 'relative' }}>
            {versGroups.map((versList, idx) => (
                <FootNoteList
                    key={idx}
                    verses={versList}
                    setFootNoteSidebar={setFootNoteSidebar}
                />
            ))}
        </div>
    );
};
