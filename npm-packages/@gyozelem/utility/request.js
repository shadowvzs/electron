const baseConfig = {
    header: {},
    method: 'GET',
    timeoutLimit: 10000,
    responseType: 'json',
    jwtAuth: true,
}

const serialize = (obj, prefix) => {
    const str = [];
    let p;
    for(p in obj) {
        if (obj.hasOwnProperty(p)) {
          const k = prefix ? prefix + "[" + p + "]" : p
          const v = obj[p];
          str.push((v !== null && typeof v === "object") ?
            serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

export class Request {

    _token = null;

    setToken(token) {
        this._token = token;
    }

    send(url, config = {}, returnOnlyData = undefined) {
        
        config = { ...baseConfig, ...config };

        const {
            file,
            header,
            method,
            responseType,
            timeoutLimit = 10000,
            jwtAuth,
        } = { ...baseConfig, ...config };

        let { contentType, data } = config;

        if (data && data.toJSON) { data = data.toJSON(); }

        if (method === 'GET' && data) {
            const query = serialize(data);
            if (query) url = url + (~url.indexOf("?") ? "&" : "?") + serialize(data);
        }

        const promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const startAt = performance.now();
            xhr.open(method || 'GET', url, true);
            if (header && typeof header === 'object' ) Object.keys(header).forEach(k =>  xhr.setRequestHeader(k, "" + header[k]));

            if (jwtAuth && this._token) {
                xhr.setRequestHeader('Authorization', `Bearer ${this._token}`);
            }

            if (timeoutLimit) {
                xhr.timeout = timeoutLimit;
                xhr.ontimeout = () => {
                    reject({
                        code: 504,
                        message: 'Gateway Timeout',
                    });
                };
            }

            if (config.abort) { config.abort = xhr.abort; }
            if (config.progress) { xhr.onprogress = config.progress; }

            xhr.responseType = responseType || 'json';
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (jwtAuth) {
                            const authHeader = xhr.getResponseHeader('Authorization') || '';
                            const auth = authHeader.split('Bearer ');
                            this.setToken(auth[1]);
                        }
                        const resp = xhr.response
                        if (!resp || resp.error) {
                            return reject(resp ? resp.error : 'Request failed: ' + url,);
                        }
                        if (returnOnlyData) {
                            resolve(resp);
                        } else {
                            resolve({
                                xhr,
                                duration: performance.now() - startAt,
                                url,
                                config,
                                data: resp
                            });
                        }
                    } else {
                        reject({
                            code: xhr.status,
                            message: xhr.statusText,
                        });
                    }
                }
            }

            if (!contentType) {
                if (data instanceof Blob) {
                    contentType = 'application/octet-stream';
                } else if (file) {
                    contentType = 'multipart/form-data';
                } else if (['POST', 'PUT', 'DELETE'].includes(method)){
                    contentType = 'application/json; charset=utf-8';
                } else {
                    contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                }
            }

            xhr.setRequestHeader('Content-Type', contentType);

            if (file) {
                const formData = new FormData();
                formData.append('file', file, file.name);
                formData.append('data', JSON.stringify(data));
                xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(formData);
            } else if (data instanceof Blob) {
                xhr.send(data);
            } else if (method === "GET" || !data) {
                xhr.send(null);
            } else if (contentType.includes('json')) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(serialize(data));
            }
        });

        return promise;
    }
}

export const request = new Request();
