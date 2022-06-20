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
import { injectable } from "inversify";
import { IServiceFactory } from "../interfaces/services";
import { IGlobalConfig, SourceType } from "../interfaces/config";
import 'reflect-metadata';
import { myContainer } from "../core/container";
import { TYPES } from "../core/types";

type CachedServices = {
    [BaseBibleRepository.$name]?: BaseBibleRepository,
    [BaseTranslatorRepository.$name]?: BaseTranslatorRepository;
    [LocalStorageService.$name]?: LocalStorageService,
    [OfflineService.$name]?: OfflineService,
}

@injectable()
export class ServiceFactory implements IServiceFactory {
    private IS_ELECTRON: boolean;
    private _defaultSourceType: SourceType;
    private _cache: CachedServices = {};

    constructor() {
        this.IS_ELECTRON = myContainer.get<IGlobalConfig>(TYPES.IGlobalConfig).IS_ELECTRON;
        this._defaultSourceType = this.IS_ELECTRON ? SourceType.Electron : SourceType.RemoteApi
    }

    public setSourceType(sourceType?: SourceType) {
        if (sourceType) {
            if (sourceType !== this._defaultSourceType) {
                Reflect.deleteProperty(this._cache, BaseBibleRepository.$name);
                Reflect.deleteProperty(this._cache, BaseTranslatorRepository.$name);
            }
            this._defaultSourceType = sourceType;
        } else if (this.IS_ELECTRON) {
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
                service = new OfflineBibleRepository();
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
                service = new OfflineTranslatorRepository();
                break;
            default:
                throw new Error('Source type not implemented.');
        }
        this._cache[BaseTranslatorRepository.$name] = service;
        return service;
    }

    public createOfflineService(): OfflineService {
        if (this._cache[OfflineService.$name]) { return this._cache[OfflineService.$name] as OfflineService; }
        const service: OfflineService = new OfflineService();
        this._cache[OfflineService.$name] = service;
        return service;
    }
}
