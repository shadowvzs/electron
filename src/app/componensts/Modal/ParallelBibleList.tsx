import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { GlobalStore, translate } from '@/app/global/GlobalStore';
import { Bible } from '@/model/Bible';

const useModalStyle = makeStyles({
    root: {
        padding: 16,
        minWidth: 320,
        '& li': {
            display: 'flex',
            flexWrap: 'no-wrap',
            alignItems: 'center',
            '& label': {
                paddingLeft: 4
            }
        }
    },
    footer: {
        paddingTop: 16,
        textAlign: 'center',
        '& button': {
            padding: '4px 8px'
        }
    }
});

export interface ParallelBibleListProps {
    globalStore: GlobalStore;
}

export const ParallelBibleList = (props: ParallelBibleListProps & { onSuccess?: (bibles: Bible[]) => void }) => {

    const [items, setItems] = React.useState<string[]>(props.globalStore.parallelBibles.map(x => x.id));
    const { bibles, baseBible, parallelBibles } = props.globalStore;
    const availableBibles = bibles.filter(x => x.id !== baseBible.id);
    const classes = useModalStyle();

    const onSuccess = React.useCallback(() => {
        if (props.onSuccess) {
            props.onSuccess(bibles.filter(x => items.includes(x.id)));
        }
    }, [items]);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.currentTarget;
        if (checked) {
            setItems([...items, value]);
        } else {
            setItems(items.filter(x => x !== value));
        }
    }, [items]);

    return (
        <div className={classes.root}>
            <ul>
                {availableBibles.map(b => (
                    <li key={b.id}>
                        <input 
                            type='checkbox' 
                            id={'add_bible_'+b.id} 
                            value={b.id} 
                            onChange={onChange}
                            checked={items.includes(b.id)}
                        />
                        <label htmlFor={'add_bible_'+b.id} children={b.name} />
                    </li>
                ))}
            </ul>
            <div className={classes.footer}>
                <button
                    children={translate('CONFIRM')}
                    onClick={onSuccess}
                />
            </div>
        </div>
    );
}
