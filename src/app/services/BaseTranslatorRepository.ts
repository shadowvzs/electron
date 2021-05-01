export type ITranslation = Record<'hu' | 'en' | 'ro', Record<string, any | string>>;
export type IAvailableLanguage = keyof ITranslation;

export abstract class BaseTranslatorRepository {
    public translations: ITranslation;
    public availableLanguages: IAvailableLanguage[];
    public currentLanguage: IAvailableLanguage;

    constructor() {
        this.translate = this.translate.bind(this);
    }

    public async getTranslations(): Promise<ITranslation> {
        throw new Error('Method not implemented.');
    }

    public translate(key: string, params?: Record<string, string>, languageOverride?: IAvailableLanguage): string {
        const keyArr = key.split('.');
        const lastKey = keyArr.pop() as string;
        console.log(key, languageOverride)
        try {
            let data: Record<string, any> = this.translations[languageOverride || this.currentLanguage];
            for (const k of keyArr) {
                data = data[k];
            }
            const translation = data[lastKey];
            return translation || key;
        } catch(err) {
            console.warn(`translation missing: ${key}`);
            return key;
        }
    }
}