export const GlobalConfig = {
    REMOTE_URL: 'http://localhost:3333/',
    IS_ELECTRON: (() => {
        try {
            require('electron');
            return true;
        } catch (ex) {
            return false;
        }
    })(),
};
