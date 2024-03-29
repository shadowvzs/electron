import { action, makeObservable, observable, toJS } from "mobx";
import { Bible } from "../model/Bible";
import { RemoteBibleRepository } from "./remote/RemoteBibleRepository";
import { injectable } from "inversify";
import { ICacheManager, ILocalStorageService, IOfflineService } from "../interfaces/services";
import { IOfflineData } from "../interfaces/models";
import { TYPES } from "../core/types";
import 'reflect-metadata';
import { myContainer } from "../core/container";

const dbScheme = {
    about: {
        id: { primaryKey: true },
        value: {},
    },
    core: {
        id: { primaryKey: true },
        value: {},
    },
    translation: {
        id: { primaryKey: true },
        value: {},
    },
    bibles: {
        id: { primaryKey: true },
        verses: {},
    }
};

type DbScheme = typeof dbScheme;


@injectable()
export class OfflineService implements IOfflineService {
    public static readonly $name = 'offlineService' as const;
    private _localStorageService: ILocalStorageService;
    private _cacheManager: ICacheManager;

    public bibles: Bible[];

    @observable
    public isDownloading: boolean = false;

    @action.bound
    public setIsDownloading(isDownloading: boolean) {
        this.isDownloading = isDownloading;
    }

    @observable
    public downloadedBookCount: number = 0;

    @action.bound
    public setDownloadedBookCount(count: number) {
        this.downloadedBookCount = count;
    }

    public downloadStartFrom: number = 0;
    public totalBookCount: number = 0;

    @observable
    public downloadState: Record<string, number> = {};

    @action.bound
    public setDownloadState(state: Record<string, number>): void {
        this.downloadState = state;
    }

    public init = async (bibles: Bible[]) => {
        console.info('offline service inited')
        this._localStorageService = myContainer.get<ILocalStorageService>(TYPES.ILocalStorageService);
        this._cacheManager = myContainer.get<ICacheManager>(TYPES.ICacheManager);
        await this._localStorageService.loadConfigAsync();
        this.bibles = bibles;
        let downloadedBookCount = 0;
        let totalBookCount = 0;
        const downloadedBible = this._localStorageService.config.downloaded.bibles;
        const initDownloadState = bibles.reduce((t, b) => {
            t[b.id] = downloadedBible.includes(b.id) ? b.books.length : 0;
            downloadedBookCount += t[b.id];
            totalBookCount += b.books.length;
            return t;
        }, {} as Record<string, number>);
        this.totalBookCount = totalBookCount;
        this.downloadStartFrom = downloadedBookCount;
        this.setDownloadedBookCount(downloadedBookCount);
        this.setDownloadState(initDownloadState);
    }

    public saveOfflineData = async ({ about, bibles, translations }: IOfflineData) => {
        // save about and translations
        await this.init(bibles);

        // --- STORE CORE DATA ---
        await this._cacheManager.set('get-installed-bibles', bibles.map(x => ({
            books: x.books,
            id: x.id,
            lang: x.lang,
            name: x.name
        })));

        // --- STORE ABOUT ---
        await this._cacheManager.set('about', about);

        // --- STORE TRANSLATIONS ---
        await this._cacheManager.set('translation', translations);

        // --- STORE BIBLES ---
        const downloadedBible = this._localStorageService.config.downloaded.bibles;
        try {
            this.setIsDownloading(true);
            // load all bible and store into indexedDb and update the observables
            for (const bible of bibles) {
                if (downloadedBible.includes(bible.id)) { continue; }
                await this.saveBible(bible);
                downloadedBible.push(bible.id);
                this._localStorageService.saveConfigAsync();
            }
            this.setIsDownloading(false);
        } catch (err) {
            this.setIsDownloading(false);
        }
    }

    private saveBible = async (bible: Bible) => {
        const books: any[] = [];
        for (const [bookName, chapterCount] of bible.books) {
            // get all verses in book from api
            const book = await RemoteBibleRepository.getBibleBook(bible.id, bookName);
            books.push(book);
            // increase the downloaded bible counter and update the download state
            this.setDownloadedBookCount(this.downloadedBookCount + 1);
            this.setDownloadState({ ...this.downloadState, [bible.id]: this.downloadState[bible.id] + 1 });
        }
        await this._cacheManager.set(`bible-${bible.id}`, books);
    }

    constructor(
        // private _localStorageService: LocalStorageService,
        // _cacheManager: CacheManager
    ) {
        // this._cacheManager = _cacheManager;
        makeObservable(this);
        // this._localStorageService.loadConfigAsync();
    }
}