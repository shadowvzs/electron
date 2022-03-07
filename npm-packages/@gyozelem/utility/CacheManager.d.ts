interface IResponseConverter {
    json: {
        from<T = Record<string, any>>(response: Response | undefined): Promise<T>,
        to(data: string | object): Promise<Blob>,
    },
    default: {
        from<T = string>(response: Response | undefined): Promise<T>,
        to(data: any): Promise<Blob>,
    };
}

type IAvalaibleType = 'json';

interface PutOptions {
    type?: IAvalaibleType;
    reqOptions?: RequestInit;
    resOptions?: ResponseInit;
    cacOptions?: CacheQueryOptions;
}

export declare class CacheManager {
    private readonly _defaultOptions: PutOptions;
    private _cache: Cache;
    constructor(private readonly cacheKey: string);
    private getConverter(type: IAvalaibleType): IResponseConverter[IAvalaibleType];
    private getRequest(key: string, options: PutOptions): Request;
    private async init(): Promise<void>;
    public async set(key: string, data: any, options?: PutOptions): Promise<void>;
    public async get(key: string, options?: PutOptions): Promise<any>;
}