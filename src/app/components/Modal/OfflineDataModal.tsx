import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { GlobalStore, translate } from '@/app/global/GlobalStore';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ProgressBar } from '../Loader/Progressbar';

export interface OfflineDataModalProps {
    globalStore: GlobalStore;
}

class OfflineDataStore {

    public bibleHelper: Record<string, { name: string, progressRatio: number }> = {};

    @computed
    public get isDownloading() {
        return this._props.globalStore.offlineService.isDownloading;
    }

    @computed
    public get progress() {
        const { downloadedBookCount, totalBookCount, downloadStartFrom } = this._props.globalStore.offlineService;
        if ((totalBookCount - downloadStartFrom) === 0) { return 0; }
        return Math.floor((downloadedBookCount - downloadStartFrom) / (totalBookCount - downloadStartFrom) * 100);
    }

    public onDownload = async () => {
        const { about, translatorService: { translations }, bibles, offlineService } = this._props.globalStore;
        offlineService.saveOfflineData({ about, bibles, translations });
    }

    constructor(protected _props: OfflineDataModalProps) {
        makeObservable(this);
        const { offlineService, bibles } = this._props.globalStore;
        offlineService.init(bibles);
        bibles.forEach(b => {
            this.bibleHelper[b.id] = { name: b.name, progressRatio: 100 / b.books.length };
        });
    }
}

export const OfflineDataModal = observer((props: OfflineDataModalProps & { onSuccess?: (item: any) => void }) => {
    const classes = useModalStyle();
    const store = React.useState(() => new OfflineDataStore(props))[0];
    const { bibleHelper, progress, isDownloading, onDownload } = store;
    const { globalStore: { offlineService }, onSuccess } = props;
    // const onSuccess = React.useCallback(() => {
    //     if (props.onSuccess) {
    //         props.onSuccess(bibles.filter(x => items.includes(x.id)));
    //     }
    // }, [items]);

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