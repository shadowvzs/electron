import { action, makeObservable, observable } from "mobx";
import { injectable } from 'inversify';
import { ISidebarData } from "../interfaces/models";
import { ISidebarService } from "../interfaces/services";
import 'reflect-metadata';

@injectable()
export class SidebarService implements ISidebarService {
    @observable.shallow
    public data: ISidebarData = {
        content: null,
        title: '',
    }

    @action.bound
    public setData(data: ISidebarData) {
        if (!data.width) {
            data.width = 320;
        }
        this.data = data;
    }

    @action.bound
    public onClose() {
        this.setData({ title: '', content: null });
    }

    constructor() {
        makeObservable(this);
    }
}