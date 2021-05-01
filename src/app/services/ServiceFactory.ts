import { BaseBibleRepository } from "./BaseBibleRepository";
import { BaseTranslatorRepository } from "./BaseTranslatorRepository";
import { ElectronBibleRepository } from "./electron/ElectronBibleRepository";
import { ElectronTranslatorRepository } from "./electron/ElectronTranslatorRepository";
import { RemoteBibleRepository } from "./remote/RemoteBibleRepository";
import { RemoteTranslatorRepository } from "./remote/RemoteTranslatorRepository";

enum SourceType {
    Electron,
    RemoteApi,
}

class ServiceFactory {
    private _defaultSourceType: SourceType;
    private _cache: Record<string, BaseBibleRepository> = {};

    constructor() {
        try {
            require('electron');
            this._defaultSourceType = SourceType.Electron;
        } catch (ex) {
            this._defaultSourceType = SourceType.RemoteApi;
        }       
    }

    public createBibleService(sourceType: SourceType = this._defaultSourceType): BaseBibleRepository {
        let service: BaseBibleRepository;
        switch(sourceType) {
            case SourceType.Electron:
                service = new ElectronBibleRepository();
                break;
            case SourceType.RemoteApi:
                service = new RemoteBibleRepository();
                break;
            default:
                throw new Error('Source type not implemented.');
        }

        return service;
    }

    public createTranslatorService(sourceType: SourceType = this._defaultSourceType): BaseTranslatorRepository {
        switch(sourceType) {
            case SourceType.Electron:
                return new ElectronTranslatorRepository();
                break;
            case SourceType.RemoteApi:
                return new RemoteTranslatorRepository();
                break;
            default:
                throw new Error('Source type not implemented.');
        }
    }
}

export const serviceFactory = new ServiceFactory();
