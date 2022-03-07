import { IS_ELECTRON } from "../global/Const";
import { BaseBibleRepository } from "./BaseBibleRepository";
import { BaseTranslatorRepository } from "./BaseTranslatorRepository";
import { ElectronBibleRepository } from "./electron/ElectronBibleRepository";
import { ElectronTranslatorRepository } from "./electron/ElectronTranslatorRepository";
import { LocalStorageService } from "./LocalStorageService";
import { OfflineBibleRepository } from "./offline/OfflineBibleRepository";
import { OfflineTranslatorRepository } from "./offline/OfflineTranslatorRepository";
import { OfflineService } from "./OfflineService";
import { RemoteBibleRepository } from "./remote/RemoteBibleRepository";
import { RemoteTranslatorRepository } from "./remote/RemoteTranslatorRepository";

export enum SourceType {
    Electron,
    RemoteApi,
    Offline
}

type CachedServices = {
    [BaseBibleRepository.$name]?: BaseBibleRepository,
    [BaseTranslatorRepository.$name]?: BaseTranslatorRepository;
    [LocalStorageService.$name]?: LocalStorageService,
    [OfflineService.$name]?: OfflineService,
}

class ServiceFactory {
    private _defaultSourceType: SourceType = IS_ELECTRON ? SourceType.Electron : SourceType.RemoteApi;
    private _cache: CachedServices = {};

    constructor(sourceType?: SourceType) {
        this._cache[LocalStorageService.$name] = new LocalStorageService();
        this.setSourceType(sourceType);
    }

    public setSourceType(sourceType?: SourceType) {
        if (sourceType) {
            if (sourceType !== this._defaultSourceType) {
                Reflect.deleteProperty(this._cache, BaseBibleRepository.$name);
                Reflect.deleteProperty(this._cache, BaseTranslatorRepository.$name);
            }
            this._defaultSourceType = sourceType;
        } else if (IS_ELECTRON) {
            this._defaultSourceType = SourceType.Electron;
        } else if (!navigator.onLine) {
            this._defaultSourceType = SourceType.Offline;
        } else {
            this._defaultSourceType = SourceType.RemoteApi;
        }
        return this;
    }

    public initAllServices() {
        return {
            bibleService: this.createBibleService(),
            offlineService: this.createOfflineService(),
            translatorService: this.createTranslatorService(),
        }
    }

    public createBibleService(sourceType: SourceType = this._defaultSourceType): BaseBibleRepository {
        let service: BaseBibleRepository;
        switch (sourceType) {
            case SourceType.Electron:
                service = new ElectronBibleRepository();
                break;
            case SourceType.RemoteApi:
                service = new RemoteBibleRepository();
                break;
            case SourceType.Offline:
                service = new OfflineBibleRepository(this.createOfflineService());
                break;
            default:
                throw new Error('Source type not implemented.');
        }

        this._cache[BaseBibleRepository.$name] = service;
        return service;
    }

    public createTranslatorService(sourceType: SourceType = this._defaultSourceType): BaseTranslatorRepository {
        let service: BaseTranslatorRepository;
        switch (sourceType) {
            case SourceType.Electron:
                service = new ElectronTranslatorRepository();
                break;
            case SourceType.RemoteApi:
                service = new RemoteTranslatorRepository();
                break;
            case SourceType.Offline:
                service = new OfflineTranslatorRepository(this.createOfflineService());
                break;
            default:
                throw new Error('Source type not implemented.');
        }
        this._cache[BaseTranslatorRepository.$name] = service;
        return service;
    }

    public createLocalStorageService(): LocalStorageService {
        if (this._cache[LocalStorageService.$name]) { return this._cache[LocalStorageService.$name]!; }
        this._cache[LocalStorageService.$name] = new LocalStorageService();
        return this._cache[LocalStorageService.$name]!;
    }

    public createOfflineService(sourceType: SourceType = this._defaultSourceType): OfflineService | undefined {
        if (this._cache[OfflineService.$name]) { return this._cache[OfflineService.$name]; }
        const service: OfflineService = new OfflineService(this.createLocalStorageService());
        this._cache[OfflineService.$name] = service;
        return service;
    }
}

export const serviceFactory = new ServiceFactory();
