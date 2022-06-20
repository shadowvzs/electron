import { myContainer } from "../core/container";
import { TYPES } from "../core/types";
import { IAvailableLanguage, ITranslation } from "../interfaces/config";
import { IBaseTranslatorRepository, IOfflineService } from "../interfaces/services";

export abstract class BaseTranslatorRepository implements IBaseTranslatorRepository {
    public static $name = 'translatorRepository' as const;

    public translations: ITranslation;
    public availableLanguages: IAvailableLanguage[];
    public currentLanguage: IAvailableLanguage;
    protected offlineService: IOfflineService;

    constructor() {
        this.offlineService = myContainer.get<IOfflineService>(TYPES.IOfflineService);
        this.translate = this.translate.bind(this);
    }

    public async getTranslations(): Promise<ITranslation> {
        throw new Error('Method not implemented.');
    }

    public translate(key: string, params?: Record<string, string>, languageOverride?: IAvailableLanguage): string {
        const keyArr = key.split('.');
        const lastKey = keyArr.pop() as string;

        try {
            let data: Record<string, any> = this.translations[languageOverride || this.currentLanguage];
            for (const k of keyArr) {
                data = data[k];
            }
            const translation = data[lastKey];
            return translation || key;
        } catch (err) {
            console.warn(`translation missing: ${key}`);
            return key;
        }
    }
}