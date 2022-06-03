import React from 'react';
import { makeStyles } from '@mui/styles';

import { App, translate } from '@/app/core/app';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import modalService, { ModalProps } from '@/app/services/ModalService';
import { Input } from '../core/Input';
import { openOfflineDataDownloader } from './OfflineDataModal';
import { ISettings } from '@/app/services/SettingsService';

export interface SettingsModalProps extends ModalProps<void, ISettings> {
    app?: App;
}

class SettingsModalStore {
    public data: ISettings;
    public setField(name: keyof ISettings, value: ISettings[keyof ISettings]) {
        this.data = { ...this.data, [name]: value };
    }

    constructor(protected _props: SettingsModalProps) {
        this.data = {} as ISettings;
        makeObservable(this, {
            data: observable,
            setField: action.bound
        });
    }
}

export const SettingsModal = observer((props: SettingsModalProps & { onSuccess?: (item: any) => void }) => {
    const classes = useModalStyle();
    const store = React.useState(() => new SettingsModalStore(props))[0];
    const { app, onSuccess, onCancel } = props;

    return (
        <section className={classes.root}>
            <main>
                <div>
                    <Input
                        type='number'
                        placeholder='font meret'
                        model={store.data}
                        property={'pista'}
                        min='1'
                        style={{ maxWidth: 50 }}
                    />
                </div>
            </main>
            <footer className={classes.footer}>
                <button
                    // disabled={isDownloading}
                    children={translate('OFFLINE_1')}
                    onClick={() => openOfflineDataDownloader()}
                />
                <button
                    // disabled={isDownloading}
                    children={translate('CLOSE')}
                    onClick={onCancel}
                />
                <button
                    // disabled={isDownloading}
                    children={translate('CONFIRM')}
                    onClick={onSuccess}
                />
            </footer>
        </section>
    );
});

const useModalStyle = makeStyles({
    root: {
        padding: 16,
        minWidth: 320,
        maxWidth: 320,
        '& header': {
            padding: 8,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,255,0.2)',
            marginBottom: 6,
            fontSize: 12
        }
    },
    downloadState: {
        display: 'flex',
        flexWrap: 'wrap',
        fontSize: 14,
        '& > div:nth-child(odd)': {
            flex: '80%',
            whiteSpace: 'pre',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        '& > div:nth-child(even)': {
            flex: '20%',
            textAlign: 'right'
        },
    },
    footer: {
        paddingTop: 16,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-around',
        '& button': {
            padding: '4px 8px'
        }
    }
});

export const openSettings = (props?: SettingsModalProps) => modalService.open<SettingsModalProps, void>(SettingsModal, {
    title: translate('OFFLINE.MODAL.TITLE'),
    data: props
});
