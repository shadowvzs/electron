# bible

## <ins>Documentation</ins>

### <ins>Intro</ins>

#### Goal
A bible web site which can be compiled to normal desktop application (windows/linux/mac), can be used normal mode (like a web site) or in PWA mode (offline website)


#### Basic commands:

   * npm run start      = build project and run like a normal web site and serve built files with express
   * npm run make-all   = create application for every known platform (use win32/win64/linux32/linux64 instead of all if you want create app for specific platform)

   * npm run build      = build 
   * npm run package    = build and handle the file dependencies



#### Technologies
 * Backend: 
      * typescript
      * nodejs - packages: express, @gyozelem/bible (for common & abstract logic between electron and nodejs)
      * electron
 * Frontend: 
      * typescript
      * react
      * mobx,
      * jss
      * cacheStorage, localStorage
      * electron, webpack, @gyozelem/bible (latest version from everything)

### <ins>Folder structure</ins>

#### Core folders
   * *electron-api* - electron related files, window and api related files, if we want build application from website
   * *node-api* - nodeJS backend if we want run the project like website
   * *src* - source files (the frontend project), all typescript stuff, css, icons etc

#### Temporary/Built folders (used for/after build)
   * *dist* - the compiled frontend project (contain assets, bibles, ***index.html***, ***main.js*** etc)
   * *bibles* - where the static db stored (right now it is file db not SQLite db) - used only for electron build
   * *release* - application releases for windows, mac, linux

#### Non related folders    
   * *npm* - package which is used in project, only used for create or update the npm package

#### Folder tree
   * root
      * bibles
      * dist
      * electron-api
      * node-api
      * npm
      * release
      * src
      * *.git*
      * *node_modules*
      * *package.json*
      * *tsconfig.json*
      * *webpack.config.js*

### How it's works?

#### Electron
   * need **electron** and **electron-packager** and few build settings in **package.json**
   * configuration in **webpack.config.js**
   * create window with config in **src/main.ts** and it use the followings
      * it will call **AppManager.ts** (window and menu management) 
      * Window config class **BibleWindow.ts**, we can set here the event
   * transfer data between **main process** and **frontend** with ipc events to receive and send data (main process have access for many thing, basically it is nodejs, can read data from db, save data, handle many backendish logic)

Electron have a nodejs main process and separatly the normal frontend, the communication between frontend and electron main process (ex. **electron-api/Backend.ts**) is working with **IPC** messaging (with events)
**Note:** important in window config (**BibleWindow.ts**) we must add **nodeIntegration: true, contextIsolation: false, enableRemoteModule: true** then we can simple use the electron package in frontend too (if page running inside in electron, else it will throw error)

* **Frontend** - anywhere frontend
```typescript
const loadTranslation = async () => {
    const params = null; // we can send any info to backend
    const translations = await this.ipcRenderer.invoke('get-translations', params);
    return translations;
}
```

* **Electron main process** (*Backend.ts*) - which is our "backend" in electron app
```typescript
import { ipcMain } from "electron";
import { BaseBackend } from '@gyozelem/bible/base-backend';

export class Backend extends BaseBackend {

    constructor(
        public basePath: string,
    ) {
        super(basePath);
        // those common methods are in our BaseBackend
        ipcMain.handle('get-translations', this.getTranslations);
    }
    
    public destroy() {
        ipcMain.removeAllListeners('get-translations');
    }
}
```

just example about listener which is assigned above, when frontend send the event with 'get-translations' event key then it will call this method, what we return here, the frontend will receive like an promise result
package: **@gyozelem/bible/base-backend**
```typescript
class BaseBackend {
    // params is what the frontend send and event just electron event, this method is not async, however still on frontend the invoke always async
    getTranslations(event: Electron.IpcMainInvokeEvent, params?: any) {
        const translations = {}; /* some logic to read out the translation */;
        /* do some logic blabla */
        return translations;
    }
}
```

* **The trick** (*on frontend*) - repository for decide our app running with electron or like website with regular web server api
Both web app and desktop app use same file however the datasource is different, but we should detect it

**Service factory**
```typescript
class ServiceFactory {
    private _defaultSourceType: SourceType;

    constructor() {
        try {
            require('electron');
            this._defaultSourceType = SourceType.Electron;
        } catch (ex) {
            // if require('eclectron') throw error that mean this is not electron app, it is normal website
            this._defaultSourceType = SourceType.RemoteApi;
        }       
    }

    // BaseTranslatorRepository is an abstract class, both electron and remote service extends it and implement methods with same name and params
    public createTranslatorService(sourceType: SourceType = this._defaultSourceType): BaseTranslatorRepository {
        switch(sourceType) {
            case SourceType.Electron:
                return new ElectronTranslatorRepository();
                break;
            case SourceType.RemoteApi:
                return new RemoteTranslatorRepository();
                break;
            default:
                throw new Error('Source type not implemented.');
        }
    }
}

```

Then you can load easily anywhere with **serviceFactory** instance
```typescript
const translatorService = serviceFactory.createTranslatorService();
const translations = await this.translatorService.getTranslations();

// or just we want only load then 
const translations = await serviceFactory.createTranslatorService().getTranslations();
```

#### NodeJs Api
Here nothing complicated, only thing, you should handle similiar each IPC event (example each should be an endpoint which return same data structure like electron backend)
We should use typescript with nodejs, so in that case we must build (*tsc*) before server start

**Frontend:** in electron service vs remote service

*ElectronTranslatorRepository.ts*
```typescript
export class ElectronTranslatorRepository extends BaseTranslatorRepository {
    private ipcRenderer: { invoke: (name: string, data: any) => Promise<any>};

    constructor() {
        super();
        this.ipcRenderer = require('electron').ipcRenderer;
    }
    
    public async getTranslations(): Promise<ITranslation> {
        return await this.ipcRenderer.invoke('get-translations', null);
    }
}
```

*RemoteTranslatorRepository.ts*
```typescript
export class RemoteTranslatorRepository extends BaseTranslatorRepository {
    public async getTranslations(): Promise<ITranslation> {
        const result = await fetch(this.REMOTE_URL + 'api/get-translations');
        return await result.json();
    }
}
```

**Backend** - endpoint which return same data like electron do
*index.ts*
```typescript
app.get('/api/get-translations', (req, res) => {
    const translations = {}; // logic to read out the translations and return back to frontend remote service
    res.send(bibles);
});
```

### Building process
 * root folder build - compile the typescript and bundle the code into single js and copy the html, assets etc into **/dist** folder
    * this **dist/main.js** is the entry point
 * if it is electron then we copy **bibles** folder into **/dist** folder and create app from the **/dist** folder
 * if nodejs then build/compile the **remote-api** (*typescript* => *javascript*) then start the server and serve statics files from **/dist** folder


### <ins>Commands</ins>
   * *npm start* - compile both frontend & backend, then it start the server
   * *npm run build* - compile the frontend
   * *npm run make-all* - compile and build app for each supported platform
   * *npm run make-linux32* - compile the frontend and create app for linux (ia32)
   * *npm run make-linux64* - compile the frontend and create app for linux (x64) + start the app after app build
   * *npm run make-win32* - compile the frontend and create app for linux (ia32)
   * *npm run make-win64* - compile the frontend and create app for linux (x64)
