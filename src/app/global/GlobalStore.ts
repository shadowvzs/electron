import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { ParallelBibleList, ParallelBibleListProps } from "../componensts/Modal/ParallelBibleList";

import { Bible, Vers } from "../../model/Bible";
import { BaseBibleRepository } from "../services/BaseBibleRepository";
import { BaseTranslatorRepository, IAvailableLanguage, ITranslation } from "../services/BaseTranslatorRepository";
import { ModalService } from "../services/ModalService";
import { serviceFactory } from "../services/ServiceFactory";

const defaultLanguage = 'hu';
export const REMOTE_API = 'http://localhost:3333/';

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

    public get usedBibles() {
        return [this.baseBible, ...this.parallelBibles];
    }

    @computed
    public get isBibleLoading() {
        return this.usedBibles.some(x => x.isLoading);
    }

    @computed
    public get allVerses(): Vers[] {
        const verses: Vers[] = [];
        let vers: Vers;

        if (this.isBibleLoading) {
            return [];
        }
        
        const maxVerses = Math.max(...this.usedBibles.map(x => x.verses.length));
        const bibles = this.usedBibles;
        for (let i = 0; i < maxVerses; i++) {
            bibles.forEach(b => {
                vers = b.verses[i];
                if (vers) {
                    vers.$contentFootnotes = b.getFootNoteInfo(vers.contentFootnotes || []);
                    vers.$footNotes = b.getFootNoteInfo(vers.footNotes || []);
                }
                verses.push(vers);
            });
        }
        return verses;
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