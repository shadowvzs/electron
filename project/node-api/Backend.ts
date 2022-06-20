import { BaseBackend } from '@gyozelem/bible/base-backend';

export class Backend extends BaseBackend {

    constructor(
        public basePath: string,
    ) {
        super(basePath);
        this.getLocaleRoot = () => `${basePath}/dist/assets/locale/`;
        this.getLocale = (name: string) => `${basePath}/dist/assets/locale/${name}`;
    }
}