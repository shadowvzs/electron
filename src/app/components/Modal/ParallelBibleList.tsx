import React from 'react';
import { makeStyles } from '@mui/styles';

import { App, translate } from '@/app/core/app';
import { Bible } from '@/app/model/Bible';
import { ModalProps } from '@/app/interfaces/config';
import { modalService } from '@/app/services/ModalService';

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

export interface ParallelBibleListProps extends ModalProps<void, Bible[]> {
    app?: App;
}

export const ParallelBibleList = (props: ParallelBibleListProps) => {

    const [items, setItems] = React.useState<string[]>(props.app!.parallelBibles.map(x => x.id));
    const { bibles, baseBible, parallelBibles } = props.app!;
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
                            id={'add_bible_' + b.id}
                            value={b.id}
                            onChange={onChange}
                            checked={items.includes(b.id)}
                        />
                        <label htmlFor={'add_bible_' + b.id} children={b.name} />
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
};

export const openParallelBibleSelect = (props?: ParallelBibleListProps) => modalService.open<ParallelBibleListProps, Bible[]>(ParallelBibleList, {
    title: translate('BIBLES.PARALLEL.SET'),
    data: props
});
