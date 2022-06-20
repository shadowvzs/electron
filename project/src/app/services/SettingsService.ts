import { injectable } from "inversify";
import { FontFamilies, ISettingConfig, ISettingOption, ISettings } from "../interfaces/config";
import { ISettingsService } from "../interfaces/services";
import 'reflect-metadata';

const fontFamilies: FontFamilies[] = [
    'Century Gothic',
    'Georgia',
    'Palatino Linotype',
    'Book Antiqua',
    'Times New Roman',
    'Helvetica',
    'Arial',
    'Arial Black',
    'Arial Narrow',
    'Garamond',
    'Judson',
    'Amaranth',
    'Baskerville',
    'Trebuchet MS',
    'Impact',
    'Lucida Sans Unicode',
    'Tahoma',
    'Verdana',
    'Courier New',
    'Lucida Console',
    'Lucida Sans Typewriter',
    'Comic Sans MS',
    'Geo',
    'Gruppo',
    'Josefin Sans',
    'Marvel',
    'Ubuntu Condensed',
    'Aladin',
    'Annie Use Your Telescope',
    'Calligraffitti',
    'Coming Soon',
    'Covered By Your Grace',
    'Crafty Girls',
    'Cookie',
    'Give You Glory',
    'Gloria Hallelujah',
    'Iceland',
    'Kranky',
    'La Belle Aurore',
    'Miltonian Tattoo',
    'Over the Rainbow',
    'Pacifico',
    'Passero One',
    'Ribeye Marrow'
];

const settingsConfig: ISettingConfig[] = [
    {
        id: 'backgroundColor',
        default: () => '#EFFFFF',
        render: 'color',
    },
    {
        id: 'fontColor',
        default: () => '#000000',
        render: 'color',
    },
    {
        id: 'fontFamily',
        default: (options?: ISettingOption[]) => options && options[0].value,
        render: 'select',
        options: fontFamilies.map(x => ({ label: x as string, value: x }))
    },
    {
        id: 'fontSize',
        default: () => 16,
        render: 'number',
    },
];


export const settingsScheme = {
    ui: settingsConfig
}

@injectable()
export class SettingsService implements ISettingsService {
    private _storageKey = 'settings';
    public settings: ISettings;

    public init = async () => {
        this.settings = JSON.parse(localStorage.getItem(this._storageKey) || '{}') as ISettings;
        Object.keys(settingsScheme).forEach(key => {
            if (typeof this.settings[key as keyof ISettings] === 'undefined') {
                this.settings[key as keyof ISettings] = {} as ISettings[keyof ISettings];
            }
            this.updatePartial(this.settings[key as keyof ISettings], key as keyof ISettings);
        });
        localStorage.setItem(this._storageKey, JSON.stringify(this.settings));
    }

    private updatePartial = (obj: ISettings[keyof ISettings], key: keyof typeof settingsScheme) => {
        settingsScheme[key]
            .filter(x => typeof obj[x.id as keyof ISettings[keyof ISettings]] === 'undefined' && typeof x.default === 'function')
            .forEach(x => obj[x.id as keyof ISettings[keyof ISettings]] = x.default!(x.options));
    }

    private updateField(key: keyof ISettings, property: keyof ISettings[keyof ISettings], value: any) {
        this.settings[key][property] = value;
    }
}
