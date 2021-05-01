import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { ParallelBibleList, ParallelBibleListProps } from "../componensts/Layout/VersContainer";
import { Bible, Vers } from "../models/Bible";
import { BaseBibleRepository } from "../services/BaseBibleRepository";
import { BaseTranslatorRepository, IAvailableLanguage, ITranslation } from "../services/BaseTranslatorRepository";
import { ModalService } from "../services/ModalService";
import { serviceFactory } from "../services/ServiceFactory";

const defaultLanguage = 'hu';

export let translate: (key: string, params?: Record<string, string>, languageOverride?: IAvailableLanguage) => string;

export class GlobalStore {

    public bibleService: BaseBibleRepository;
    public translatorService: BaseTranslatorRepository;
    public modalService: ModalService;

    @observable
    public loading: boolean = false;

    @action.bound
    public setLoading(loading: boolean) { this.loading = loading; }

    @observable
    public bibles: Bible[] = [];

    @action.bound
    public setBibles(bibles: Bible[]) { this.bibles = bibles; }

    @observable
    public parallelBibles: Bible[] = [];

    @action.bound
    public setParallelBibles(bibles: Bible[]) { 
        bibles.forEach(b => {
            b.setCurrentBook(this.baseBible.currentBook);
            b.setCurrentChapter(this.baseBible.currentChapter);
        })
        this.parallelBibles = bibles; 
    }

    @action.bound
    public onAddBibles() {   
        this.modalService.open<ParallelBibleListProps, Bible[]>(ParallelBibleList, {
            title: 'ADD.PARALLEL.BIBLES',
            data: { globalStore: this }
        }).then(bibleIds => {
            this.setParallelBibles(this.bibles.filter(x => bibleIds.includes(x)));
        });
    };

    @observable
    public baseBible: Bible = null!;

    @observable
    public currentLanguage: IAvailableLanguage = null!;

    @action.bound
    public setCurrentLanguage(language: IAvailableLanguage) {
        this.currentLanguage = language;
        this.translatorService.currentLanguage = language;
        const bible = this.bibles.find(x => x.lang === language) || this.bibles[0];
        if (this.baseBible) {
            bible.setCurrentBook(this.baseBible.currentBook);
            bible.setCurrentChapter(this.baseBible.currentChapter);
        }
        this.baseBible = bible;
    }

    public get availableLanguages() {
        return this.translatorService.availableLanguages;
    }

    constructor() {
        makeObservable(this)
        this.init();
    }

    public async init() {
        this.setLoading(true);
        
        this.modalService = new ModalService({ containerSelector: '#modalRoot' });

        this.translatorService = serviceFactory.createTranslatorService();
        await this.translatorService.getTranslations();
        translate = this.translatorService.translate;

        this.bibleService = serviceFactory.createBibleService();
        this.bibles = await this.bibleService.getInstalledBibles();
        
        this.setCurrentLanguage(defaultLanguage);

        this.setLoading(false);

    }

    public destroy() {
        // some clean up here
    }
}