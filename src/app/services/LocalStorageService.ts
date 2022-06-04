import { injectable } from "inversify";
import { IConfig, IConfigKey, IConfigValue } from "../interfaces/models";
import { ILocalStorageService } from "../interfaces/services";
import 'reflect-metadata';

const defaultConfig: IConfig = {
    settings: {
        valami: 1
    },
    downloaded: {
        about: false,
        bibles: [],
        languages: [],
    }
}


@injectable()
export class LocalStorageService implements ILocalStorageService {
    public static readonly $name = 'localStorageService' as const;
    public config: IConfig = defaultConfig;
    private readonly _configKey = 'configV1';

    public loadConfig = () => {
        try {
            const config = JSON.parse(localStorage.getItem(this._configKey)!);
            this.config = config || defaultConfig;
            return config;
        } catch (err) {
            return this.config;
        }
    }

    public loadConfigAsync = () => new Promise((resolve) => { this.loadConfig(); resolve(true); });
    public saveConfig = () => { localStorage.setItem(this._configKey, JSON.stringify(this.config)); }
    public saveConfigAsync = () => new Promise((resolve) => { this.saveConfig(); resolve(true); });

    public updateConfig = (key: IConfigKey, value: IConfigValue) => {
        this.config[key] = value;
        this.saveConfig();
        return this.config;
    }

    public updateConfigAsync = (key: IConfigKey, value: IConfigValue) => new Promise((resolve) => resolve(this.updateConfig(key, value)));

    constructor() {
        this.loadConfigAsync();
    }
}
