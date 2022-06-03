import { REMOTE_URL } from "@/app/global/Const";
import { BaseTranslatorRepository, IAvailableLanguage, ITranslation } from "../BaseTranslatorRepository";

export class OfflineTranslatorRepository extends BaseTranslatorRepository {
    public async getTranslations(): Promise<ITranslation> {
        if (!this.offlineService) {
            throw Error('missing offline service');
        }
        this.translations = await this.offlineService.cacheManager.get('translation') as ITranslation;
        this.availableLanguages = Object.keys(this.translations) as IAvailableLanguage[];
        return this.translations;
    }
}
