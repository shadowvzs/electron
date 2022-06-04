import { injectable } from "inversify";
import { IAvalaibleType, ICacheManager, IPutOptions, IResponseConverter } from "../interfaces/services";
import 'reflect-metadata';

const mimeMap = {
    json: 'application/json;charset=utf-8',
};

const responseConverterMap: IResponseConverter = {
    json: {
        async from(response) {
            if (!response) { return undefined; }
            const json = await response.json();
            return json;
        },
        async to(data) {
            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }
            const bytes = new TextEncoder().encode(data);
            const blob = new Blob([bytes], { type: mimeMap['json'] });
            return blob;
        }
    },
    default: {
        async from<T = string>(response: Response | undefined): Promise<T> {
            if (!response) { return undefined!; }
            const text = await response.text() as unknown as T;
            return text;
        },
        async to(data) {
            return data;
        },
    }
}

@injectable()
export class CacheManager implements ICacheManager {
    private readonly _defaultOptions: Partial<IPutOptions> = {
        type: 'json',
        reqOptions: {
            method: 'GET'
        },
    }

    private _cache: Cache;

    constructor(
        private cacheKey: string = 'cached-json-data',
    ) {
        this.cacheKey = cacheKey;
        this.init();
    }

    private getConverter(type: IAvalaibleType | 'default') {
        return responseConverterMap[type] || responseConverterMap['default'];
    }

    private getRequest(key: string, options: IPutOptions) {
        return new Request(`/${key}`, options.reqOptions);
    }

    private async init(): Promise<void> {
        this._cache = await window.caches.open(this.cacheKey);
    }

    public async set(key: string, data: any, options?: IPutOptions): Promise<void> {
        const opt = { ...this._defaultOptions, ...options };
        const request = this.getRequest(key, opt);
        const converter = this.getConverter(opt.type as IAvalaibleType);
        const responseData = await converter.to(data);
        const response = new Response(responseData, opt.resOptions);
        await this._cache.put(request, response);
    }

    public async get(key: string, options?: IPutOptions): Promise<any> {
        const opt = { ...this._defaultOptions, ...options };
        const request = this.getRequest(key, opt);
        const res = await this._cache.match(request, opt.cacOptions);
        const converter = this.getConverter(opt.type as IAvalaibleType);
        const data = await converter.from(res);
        return data;
    }
}
