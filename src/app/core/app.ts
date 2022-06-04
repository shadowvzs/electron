import { action, computed, makeObservable, observable } from "mobx";
import di from '@gyozelem/utility/dep-injector';

import { Bible } from "../model/Bible";
import { BaseBibleRepository } from "../services/BaseBibleRepository";
import { BaseTranslatorRepository } from "../services/BaseTranslatorRepository";
import { ModalService } from "../services/ModalService";
import { ServiceFactory } from "../services/ServiceFactory";
import { SidebarService } from "../services/SidebarService";
import { renderFootNoteList } from "../components/Sidebar/FootNoteList";


import { OfflineService } from "../services/OfflineService";
import { CacheManager } from "@gyozelem/utility/CacheManager";
import { LocalStorageService } from "../services/LocalStorageService";
import { SettingsService } from "../services/SettingsService";
import { IAbout, IVers } from "../interfaces/models";
import { IAvailableLanguage } from "../interfaces/config";
import { inject } from "inversify";
import { TYPES } from "./types";
import 'reflect-metadata';
import { myContainer } from "./container";
import { ICacheManager, ILocalStorageService, IModalService, IServiceFactory, ISettingsService, ISidebarService } from "../interfaces/services";

const defaultLanguage = 'hu';
export const REMOTE_API = 'http://localhost:3333/';

export let translate: (key: string, params?: Record<string, string>, languageOverride?: IAvailableLanguage) => string = (key) => key;

// @di.InjectableSingleton("IToast1")
// class A {
//     getName() {
//         return Math.random();
//     }
// }

// @di.InjectableSingleton("IToast2")
// class B {
//     getType() {
//         return Math.random();
//     }
// }

// @di.InjectableClass()
// class C {

//     @di.InjectProperty("IToast1")
//     public toast1: A;

//     @di.InjectProperty("IToast2")
//     public toast2: B;

//     constructor(public valami: number) { }
// }

// const c = new C(1);
// (window as any)['aaa'] = c;
// console.log(c, c.toast1.getName(), c.toast2.getType(), c.valami);

type BibleParams = { bibleId: string, bookId: string, chapterId: number, versId: number, limit: number };

enum ServiceMode {
    Normal,
    Offline
}

export class App {

    public bibleService: BaseBibleRepository;
    public translatorService: BaseTranslatorRepository;
    public offlineService: OfflineService;
    
    public about: IAbout;

    @observable
    public loading: boolean = false;

    @action.bound
    public setLoading(loading: boolean) { this.loading = loading; }

    @observable
    public mode: ServiceMode = ServiceMode.Normal;

    @action.bound
    public setMode(mode: ServiceMode) { this.mode = mode; };

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

    @observable
    public baseBible: Bible = null!;

    @observable
    public currentLanguage: IAvailableLanguage = null!;

    @action.bound
    public setCurrentLanguage(language: IAvailableLanguage) {
        this.currentLanguage = language;
        this.translatorService.currentLanguage = language;
        if (this.baseBible) {
            const newBaseBibleId = this.getCurrentBible().id;
            let path = `/?bibleId=${newBaseBibleId}`;
            if (this.baseBible.currentBook) {
                path += `&bookId=${this.baseBible.currentBook}`;
                if (this.baseBible.currentChapter) { path += `&chapterId=${this.baseBible.currentChapter}`; }
            }
            this.navigate(path);
        }
    }

    public getCurrentBible = () => {
        return this.bibles.find(x => x.lang === this.currentLanguage) || this.bibles[0];
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
    public get allVerses(): IVers[] {
        const verses: IVers[] = [];
        let vers: IVers;

        if (this.isBibleLoading) {
            return [];
        }

        // x.verses is undefined
        // another problem is the maxChapter
        const maxVerses = Math.max(...this.usedBibles.map(x => x.verses.length));
        const bibles = this.usedBibles;
        for (let i = 0; i < maxVerses; i++) {
            bibles.forEach(b => {
                vers = b.verses[i];
                if (vers) {
                    vers.$contentFootnotes = b.getFootNoteInfo(vers.contentFootnotes || []);
                    vers.$footNotes = b.getFootNoteInfo(vers.footNotes || []);
                    vers.$bible = b;
                }
                verses.push(vers);
            });
        }
        return verses;
    }

    public setFootNoteSidebar = async (bible: Bible, id: string) => {
        const versIds = id.startsWith('all_') ? id.split('_')[1].split('#') : [id];
        const footNotes = versIds.map(i => BaseBibleRepository.rawFootNoteToObject(i, bible));
        const verses = await this.bibleService.getFootNotes(footNotes, bible.id)
        this.sidebarService.setData({
            title: translate('FOOTNOTE.NAME'),
            content: renderFootNoteList(verses, this.setFootNoteSidebar)
        });
    }

    public _navigate: (path: string, state?: unknown) => void;
    public navigate = (path: string, state?: unknown) => {
        this._navigate(path, state);
        this.navigateTo(this.extractBibleUrlParams(path));
    };

    public extractBibleUrlParams = (path: string): BibleParams => {
        const params = {
            bibleId: this.getCurrentBible().id,
            bookId: '',
            chapterId: 0,
            versId: 0,
            limit: 0
        };
        const newParams = (path.split('?').pop() || '').split('&').reduce((t, c) => {
            const [k, v] = c.split('=');
            if (t.hasOwnProperty(k)) { return t; }
            if (k === 'bibleId' || k === 'bookId') {
                t[k] = v;
            } else if (['chapterId', 'versId', 'limit'].includes(k)) {
                t[k as 'chapterId' | 'versId' | 'limit'] = parseInt(v);
            }
            return t;
        }, {} as typeof params);
        return { ...params, ...newParams };
    }

    @action.bound
    public navigateTo({ bibleId, bookId, chapterId, versId, limit }: Partial<BibleParams>) {
        if (!this.baseBible) {
            this.baseBible = this.bibles.find(x => x.id === bibleId)!;
        }
        const allBible = [this.baseBible, ...this.parallelBibles];
        const bible = bibleId && this.bibles.find(x => x.id === bibleId);
        if (bible && this.baseBible !== bible) {
            const oldBaseBible = this.baseBible;
            if (!bookId) { bookId = oldBaseBible?.currentBook; }
            if (!chapterId) { chapterId = oldBaseBible?.currentChapter; }
            if (!versId) { versId = oldBaseBible?.currentVers; }
            if (!limit) { limit = oldBaseBible?.limit; }
            const idx = this.parallelBibles.findIndex(x => x.id === bible.id);
            this.baseBible = bible;
            if (!allBible.some(x => x.id === bible.id)) { allBible.push(bible); }
            if (idx >= 0) {
                const bList = this.parallelBibles;
                bList.splice(idx, 1, oldBaseBible);
                this.setParallelBibles([...bList]);
            }
        }

        allBible.forEach(bible => {
            if (typeof bookId !== 'undefined') { bible.setCurrentBook(bookId); }
            if (typeof chapterId !== 'undefined') {
                bible.currentChapter = chapterId;
                bible.setCurrentChapter(chapterId);
            }
            if (typeof versId !== 'undefined') { bible.setCurrentVers(versId); }
            if (typeof limit !== 'undefined') { bible.setLimit(limit); }
        });
    }

    @observable.shallow
    public windowSize: { x: number, y: number } = { x: window.innerWidth, y: window.innerHeight };

    @computed
    public get currentBreakPoint(): 'xl' | 'lg' | 'md' | 'sm' | 'xs' {
        const x = this.windowSize.x;
        if (x > 1920) {
            return 'xl';
        } else if (x > 1280) {
            return 'lg';
        } else if (x > 960) {
            return 'md';
        } else if (x > 600) {
            return 'sm';
        } else {
            return 'xs';
        }
    }

    @computed
    public get isMobile() {
        return this.currentBreakPoint === 'xs';
    }

    public localStorageService: ILocalStorageService;
    public sidebarService: ISidebarService;
    public modalService: IModalService;
    public cacheManager: ICacheManager;
    public serviceFactory: IServiceFactory;
    public settingsService: ISettingsService;

    constructor() {
        makeObservable(this);
        this.localStorageService = myContainer.get<ILocalStorageService>(TYPES.ILocalStorageService);
        this.sidebarService = myContainer.get<ISidebarService>(TYPES.ISidebarService);
        this.modalService = myContainer.get<IModalService>(TYPES.IModalService);
        this.cacheManager = myContainer.get<ICacheManager>(TYPES.ICacheManager);
        this.serviceFactory = myContainer.get<IServiceFactory>(TYPES.IServiceFactory);
        this.settingsService = myContainer.get<ISettingsService>(TYPES.ISettingsService);
        (window as any)['globalStore'] = this;
    }

    public init = async () => {
        this.setLoading(true);

        if (this.modalService) { this.modalService.init({ app: this, containerSelector: '#modalRoot' }); }
        await this.localStorageService.loadConfigAsync();
        await (this.cacheManager as any).init();

        // SourceType.Offline
        const { bibleService, offlineService, translatorService } = this.serviceFactory.setSourceType(/*SourceType.Offline*/).initAllServices();
        this.offlineService = offlineService!;
        this.translatorService = translatorService;
        this.bibleService = bibleService;
 
        if (!translatorService.translations) {
            await this.translatorService.getTranslations();
        }

        translate = this.translatorService.translate;
        await this.settingsService.init();
        this.bibles = await this.bibleService.getInstalledBibles();
        this.about = await this.bibleService.about();

        this.sidebarService = new SidebarService();
        if (!this.currentLanguage) {
            this.setCurrentLanguage(defaultLanguage);
        }

        this.navigateTo({ bibleId: this.getCurrentBible().id });
        this.setLoading(false);
        window.addEventListener('resize', this.onWindowResize);
    }

    @action.bound
    private onWindowResize() {
        this.windowSize = { x: document.body.clientWidth, y: document.body.clientHeight };
    }

    public destroy() {
        // some clean up here
        window.removeEventListener('resize', this.onWindowResize);
    }
}

export const app = new App();
