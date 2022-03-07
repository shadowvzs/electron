interface IConfig {
    settings: {
        valami: any;
    },
    downloaded: {
        about: boolean;
        bibles: string[];
        languages: string[];
    }
}

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

type IConfigKey = keyof IConfig;
type IConfigValue = any;

export class LocalStorageService {
    public static $name = 'localStorageService' as const;

    public config: IConfig = defaultConfig;
    public configKey = 'configV1';

    public loadConfig = () => {
        try {
            const config = JSON.parse(localStorage.getItem(this.configKey)!);
            this.config = config || defaultConfig;
            return config;
        } catch (err) {
            return this.config;
        }
    }

    public loadConfigAsync = () => new Promise((resolve) => { this.loadConfig(); resolve(true); });
    public saveConfig = () => { localStorage.setItem(this.configKey, JSON.stringify(this.config)); }
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