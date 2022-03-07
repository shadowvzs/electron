export interface IConfig {
    container?: string | HTMLElement;
    cssStyle?: string;
}

export declare class Notify {
    public static instance: Notify;
    public static init(config?: IConfig): Notify
    public static send(type: "success" | "error" | "warning" | "normal", message: string): void;
    constructor(config?: IConfig);
    public send(type: "success" | "error" | "warning" | "normal", message: string): void;
    public destroy(): void;
}
