import React from 'react';
import { makeStyles } from '@mui/styles';

import { App, translate } from '@/app/core/app';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ProgressBar } from '../Loader/Progressbar';
import modalService, { ModalProps } from '@/app/services/ModalService';

export interface DownloadOfflineDataModalProps extends ModalProps<void, void> {
    app: App;
}

class DownloadOfflineDataStore {

    public bibleHelper: Record<string, { name: string, progressRatio: number }> = {};

    @computed
    public get isDownloading() {
        return this._props.app.offlineService.isDownloading;
    }

    @computed
    public get progress() {
        const { downloadedBookCount, totalBookCount, downloadStartFrom } = this._props.app.offlineService;
        console.log(
            downloadedBookCount, totalBookCount, downloadStartFrom
        )
        if (downloadedBookCount === totalBookCount) {
            return 100;
        } else if ((totalBookCount - downloadStartFrom) === 0) {
            return 0;
        }
        return Math.floor((downloadedBookCount - downloadStartFrom) / (totalBookCount - downloadStartFrom) * 100);
    }

    public onDownload = async () => {
        const { about, translatorService: { translations }, bibles, offlineService } = this._props.app;
        offlineService.saveOfflineData({ about, bibles, translations });
    }

    public onSuccess() {
        if (!this._props.onSuccess) { return; }
        this._props.onSuccess();
    }

    constructor(protected _props: DownloadOfflineDataModalProps) {
        makeObservable(this);
        const { offlineService, bibles } = this._props.app;
        offlineService.init(bibles);
        bibles.forEach(b => {
            this.bibleHelper[b.id] = { name: b.name, progressRatio: 100 / b.books.length };
        });
    }
}

export const DownloadOfflineDataModal = observer((props: DownloadOfflineDataModalProps) => {
    const classes = useModalStyle();
    const store = React.useState(() => new DownloadOfflineDataStore(props))[0];
    const { bibleHelper, progress, isDownloading, onDownload } = store;
    const { app: { offlineService } } = props;

    return (
        <section className={classes.root}>
            <header>
                <p>{translate('OFFLINE.MODAL.HEADER_TEXT')}</p>
            </header>
            <main className={classes.downloadState}>
                {Object.entries(offlineService.downloadState).map(([id, progress]) => (
                    <React.Fragment key={id}>
                        <div>{bibleHelper[id].name}</div>
                        <div>{Math.floor(progress * bibleHelper[id].progressRatio)}%</div>
                    </React.Fragment>
                ))}
            </main>
            <ProgressBar title={translate('OFFLINE.MODAL.TOTAL_PROGRESS')} progress={progress} />
            <footer className={classes.footer}>
                <button
                    disabled={isDownloading}
                    children={translate('CONFIRM')}
                    onClick={onDownload}
                />
                <button
                    disabled={isDownloading}
                    children={translate('CLOSE')}
                    onClick={store.onSuccess}
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

export const openOfflineDataDownloader = (props?: DownloadOfflineDataModalProps) => modalService.open<DownloadOfflineDataModalProps, void>(DownloadOfflineDataModal, {
    title: translate('OFFLINE.MODAL.TITLE'),
    data: props
});
