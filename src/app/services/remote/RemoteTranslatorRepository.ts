import { REMOTE_URL } from "@/app/global/Const";
import { BaseTranslatorRepository, IAvailableLanguage, ITranslation } from "../BaseTranslatorRepository";

export class RemoteTranslatorRepository extends BaseTranslatorRepository {
    public async getTranslations(): Promise<ITranslation> {
        const result = await fetch(REMOTE_URL + 'api/get-translations');
        this.translations = await result.json();
        this.availableLanguages = Object.keys(this.translations) as IAvailableLanguage[];
        return this.translations;
    }
}
