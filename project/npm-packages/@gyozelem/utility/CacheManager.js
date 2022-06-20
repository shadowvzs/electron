const mimeMap = {
    json: 'application/json;charset=utf-8',
};

const responseConverterMap = {
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
        async from(response) {
            if (!response) { return undefined; }
            const text = await response.text();
            return text;
        },
        async to(data) {
            return data;
        },
    }
}


export class CacheManager {
    _defaultOptions = {
        type: 'json',
        reqOptions: {
            method: 'GET'
        },
    }

    _cache = {};

    constructor(
        cacheKey,
    ) {
        this.cacheKey = cacheKey;
        this.init();
    }

    getConverter(type) {
        return responseConverterMap[type] || responseConverterMap['default'];
    }

    getRequest(key, options) {
        return new Request(`/${key}`, options.reqOptions);
    }

    async init() {
        this._cache = await window.caches.open(this.cacheKey);
    }

    async set(key, data, options) {
        const opt = { ...this._defaultOptions, ...options };
        const request = this.getRequest(key, opt);
        const converter = this.getConverter(opt.type);
        const responseData = await converter.to(data);
        const response = new Response(responseData, opt.resOptions);
        await this._cache.put(request, response);
    }

    async get(key, options) {
        const opt = { ...this._defaultOptions, ...options };
        const request = this.getRequest(key, opt);
        const res = await this._cache.match(request, opt.cacOptions);
        const converter = this.getConverter(opt.type);
        const data = await converter.from(res);
        return data;
    }
}