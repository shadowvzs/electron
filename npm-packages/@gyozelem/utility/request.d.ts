
export interface IConfig {
    abort?: true | Callback;
    data?: Record<string, string | number | boolean | object | any>;
    file?: File;
    header?: Record<string, string | number>;
    method?: Method;
    contentType?: string;
    responseType?: ResponseType;
    timeoutLimit?: number;
    jwtAuth?: boolean;

    progress?: EventCallback;
    getXHR?: (xhr: XMLHttpRequest) => void;
}

export type IResponse<T> = Promise<{ 
    xhr: XMLHttpRequest;
    url: string;
    config: Config;
    data: T;
    duration: number;
}>;

export declare class Request {
    public send<T>(url: string): IResponse<T>;
    public send<T>(url: string, config: IConfig): IResponse<T>;
    public send<T>(url: string, config: IConfig, returnOnlyData: true): T;
}

export const request = new Request();
