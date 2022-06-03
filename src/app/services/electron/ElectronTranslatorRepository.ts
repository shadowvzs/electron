import { BaseTranslatorRepository, IAvailableLanguage, ITranslation } from "../BaseTranslatorRepository";

export class ElectronTranslatorRepository extends BaseTranslatorRepository {
    private ipcRenderer: { invoke: (name: string, data: any) => Promise<any>};

    constructor() {
        super();
        this.ipcRenderer = require('electron').ipcRenderer;
    }

    public async getTranslations(): Promise<ITranslation> {
        this.translations = await this.ipcRenderer.invoke('get-translations', null);
        this.availableLanguages = Object.keys(this.translations) as IAvailableLanguage[];
        return this.translations;
    }

}
