import { action, makeObservable, observable } from "mobx";

interface IData {
    content: JSX.Element | null;
    title: string;
    width?: number | string;
}

export class SidebarService {
    @observable.shallow
    public data: IData = {
        content: null,
        title: '',
    }

    @action.bound
    public setData(data: IData) {
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