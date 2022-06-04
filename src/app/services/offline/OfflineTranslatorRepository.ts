import { myContainer } from "@/app/core/container";
import { TYPES } from "@/app/core/types";
import { REMOTE_URL } from "@/app/global/Const";
import { IAvailableLanguage, ITranslation } from "@/app/interfaces/config";
import { ICacheManager } from "@/app/interfaces/services";
import { inject } from "inversify";
import { BaseTranslatorRepository } from "../BaseTranslatorRepository";

export class OfflineTranslatorRepository extends BaseTranslatorRepository {
    @inject(TYPES.ICacheManager)
    private _cacheManager: ICacheManager;

    constructor() {
        super();
        this._cacheManager = myContainer.get<ICacheManager>(TYPES.ICacheManager);
    }
    
    public async getTranslations(): Promise<ITranslation> {
        if (!this.offlineService) {
            throw Error('missing offline service');
        }
        this.translations = await this._cacheManager.get('translation') as ITranslation;
        this.availableLanguages = Object.keys(this.translations) as IAvailableLanguage[];
        return this.translations;
    }
}
