import { FootNoteObj, SearchQueryParams } from "@gyozelem/bible/base-backend";
import { BaseBibleRepository } from "../services/BaseBibleRepository";
import { BaseTranslatorRepository } from "../services/BaseTranslatorRepository";
import { OfflineService } from "../services/OfflineService";
import { IAvailableLanguage, IModalConfig, ITranslation, ModalProps, SourceType } from "./config";
import { IAbout, IBible, IConfig, IConfigKey, IConfigValue, IOfflineData, ISidebarData, IVers } from "./models";

export declare class IBibleStore {
    searchLoading: boolean;
    setSearchLoading(status: boolean): void;
    searchResult: IVers[];
    setSearchResult(verses: IVers[]): void;
}

export declare class IBaseBibleRepository {
    store: IBibleStore;
    getInstalledBibles(): Promise<IBible[]>;
    getBible(bibleId: string): Promise<IBible>;
    getBibleBook(bibleId: string, bookId: string): Promise<IVers[][]>;
    getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<IVers[]>;
    getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<IVers[][]>;
    search(data: SearchQueryParams): Promise<IVers[]>
    about(): Promise<IAbout>;
}

export declare class IBaseTranslatorRepository {
    translations: ITranslation;
    availableLanguages: IAvailableLanguage[];
    currentLanguage: IAvailableLanguage;
    getTranslations(): Promise<ITranslation>;
    translate(key: string, params?: Record<string, string>, languageOverride?: IAvailableLanguage): string;
}


export declare class IOfflineService {
    bibles: IBible[];
    isDownloading: boolean;
    setIsDownloading(isDownloading: boolean): void;
    downloadedBookCount: number;
    setDownloadedBookCount(count: number): void;
    downloadStartFrom: number;
    totalBookCount: number;
    downloadState: Record<string, number>
    setDownloadState(state: Record<string, number>): void;
    init(bibles: IBible[]): Promise<void>;
    saveOfflineData({ about, bibles, translations }: IOfflineData): Promise<void>;
}

export declare class ILocalStorageService {
    config: IConfig;
    loadConfigAsync(): Promise<unknown>; 
    saveConfig(): void;
    saveConfigAsync(): void;
    updateConfig(key: IConfigKey, value: IConfigValue): IConfig;
    updateConfigAsync(key: IConfigKey, value: IConfigValue): Promise<unknown>;
}

export declare class ISidebarService {
    data: ISidebarData;
    setData(data: ISidebarData): void;
    onClose(): void;
}

export declare class ISettingsService {
    init(): Promise<void>;
}

export declare class IModalService {
    init(config: IModalConfig): IModalService;
    open<P, R>(Cmp: (props: P & Pick<ModalProps<P, R>, 'onClose' | 'onSuccess'>) => JSX.Element, props: Partial<ModalProps<P, R>>): Promise<R>
}

export declare class IServiceFactory {
    setSourceType(sourceType?: SourceType): IServiceFactory;
    createBibleService(sourceType?: SourceType): IBaseBibleRepository;
    createTranslatorService(sourceType?: SourceType): IBaseTranslatorRepository;
    createOfflineService(): IOfflineService | undefined;
    initAllServices(): {
        bibleService: BaseBibleRepository,
        offlineService: OfflineService,
        translatorService: BaseTranslatorRepository
    }
}


export interface IResponseConverter {
    json: {
        from<T = Record<string, any>>(response: Response | undefined): Promise<T>,
        to(data: string | object): Promise<Blob>,
    },
    default: {
        from<T = string>(response: Response | undefined): Promise<T>,
        to(data: any): Promise<Blob>,
    };
}

export type IAvalaibleType = 'json';
export interface IPutOptions {
    type?: IAvalaibleType;
    reqOptions?: RequestInit;
    resOptions?: ResponseInit;
    cacOptions?: CacheQueryOptions;
}

export declare class ICacheManager {
    constructor(configKey?: string);    
    set(key: string, data: any, options?: IPutOptions): Promise<void>;
    get(key: string, options?: IPutOptions): Promise<any>;
}