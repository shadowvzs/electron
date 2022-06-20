import { myContainer } from "@/app/core/container";
import { TYPES } from "@/app/core/types";
import { IAvailableLanguage, IGlobalConfig, ITranslation } from "@/app/interfaces/config";
import { BaseTranslatorRepository } from "../BaseTranslatorRepository";

export class RemoteTranslatorRepository extends BaseTranslatorRepository {
    private REMOTE_URL: string;
    
    constructor() {
        super();
        this.REMOTE_URL = myContainer.get<IGlobalConfig>(TYPES.IGlobalConfig).REMOTE_URL;
    }

    public async getTranslations(): Promise<ITranslation> {
        const result = await fetch(this.REMOTE_URL + 'api/get-translations');
        this.translations = await result.json();
        this.availableLanguages = Object.keys(this.translations) as IAvailableLanguage[];
        return this.translations;
    }
}
