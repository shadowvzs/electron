"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = void 0;
const base_backend_1 = require("@gyozelem/bible/base-backend");
class Backend extends base_backend_1.BaseBackend {
    constructor(basePath) {
        super(basePath);
        this.basePath = basePath;
        this.getLocaleRoot = () => `${basePath}/dist/assets/locale/`;
        this.getLocale = (name) => `${basePath}/dist/assets/locale/${name}`;
    }
}
exports.Backend = Backend;
