export const REMOTE_URL = 'http://localhost:3333/';
export const IS_ELECTRON = (() => {
    try {
        require('electron');
        return true;
    } catch (ex) {
        return false;
    }
})();
