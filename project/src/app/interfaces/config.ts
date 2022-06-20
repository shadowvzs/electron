
export interface IModalConfig<T = any> {
    app: T;
    containerSelector: string,
}

export interface ModalProps<P, R> {
    app?: any;
    data?: P;
    title?: string;
    onCancel: () => void,
    onClose?: () => void;
    onSuccess: (result: R) => void;
}


export type FontFamilies = 'Century Gothic' | 'Georgia' | 'Palatino Linotype' |
            'Book Antiqua' | 'Times New Roman' | 'Helvetica' |
            'Arial' | 'Arial Black' | 'Arial Narrow' | 'Garamond' |
            'Judson' | 'Amaranth' | 'Baskerville' | 'Trebuchet MS' |
            'Impact' | 'Lucida Sans Unicode' | 'Tahoma' | 'Verdana' |
            'Courier New' | 'Lucida Console' | 'Lucida Sans Typewriter' |
            'Comic Sans MS' | 'Geo' | 'Gruppo' | 'Josefin Sans' |
            'Marvel' | 'Ubuntu Condensed' | 'Aladin' | 'Annie Use Your Telescope' |
            'Calligraffitti' | 'Coming Soon' | 'Covered By Your Grace' |
            'Crafty Girls' | 'Cookie' | 'Give You Glory' | 'Gloria Hallelujah' |
            'Iceland' | 'Kranky' | 'La Belle Aurore' | 'Miltonian Tattoo' |
            'Over the Rainbow' | 'Pacifico' | 'Passero One' | 'Ribeye Marrow';

export interface IUISettings {
    backgroundColor: string;
    fontColor: string;
    fontFamily: FontFamilies;
    fontSize: number;
}

export interface ISettingOption {
    label: string;
    value: string;
}

export interface ISettingConfig {
    id: string;
    default?: (options?: ISettingOption[]) => any;
    render?: 'color' | 'select' | 'number';
    options?: { label: string, value: string; }[];
}

export interface ISettings {
    ui: IUISettings[];
}

export enum SourceType {
    Electron,
    RemoteApi,
    Offline
}

export type ITranslation = Record<'hu' | 'en' | 'ro', Record<string, any | string>>;
export type IAvailableLanguage = keyof ITranslation;

export interface IGlobalConfig {
    REMOTE_URL: string;
    IS_ELECTRON: boolean;
}