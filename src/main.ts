import { app } from 'electron';
import { appManager } from '../electron-api/AppManager';
import { BibleWindow } from '../electron-api/BibleWindow';

// used for electron

app.on('ready', () => {
    appManager.setWindow('BibleWindow', new BibleWindow());
});

// ------ register service worker ------
// if ('serviceWorker' in navigator && !IS_ELECTRON) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('sw/sw.js', { scope: '/' }).then(function (registration) {
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function (err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }
// -------------------------------------

// React.useEffect(() => {
//     globalStore._navigate = history.push;
//     // const w = new Worker("./lib/indexedDB.js");
//     // w.onmessage = function(event) {
//     //     console.log(event.data);
//     // };

//     // w.postMessage({ type: "init", pistaFn: 'tostring' });

//     // w.postMessage("readAll");
// }, []);