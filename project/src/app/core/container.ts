import { Container } from 'inversify';
import { TYPES } from './types';
import { 
    IOfflineService,
    ILocalStorageService,
    ISidebarService,
    ISettingsService,
    IModalService,
    IServiceFactory,
    ICacheManager
} from '../interfaces/services';
import { LocalStorageService } from '../services/LocalStorageService';
import { ModalService } from '../services/ModalService';
import { OfflineService } from '../services/OfflineService';
import { ServiceFactory } from '../services/ServiceFactory';
import { SettingsService } from '../services/SettingsService';
import { SidebarService } from '../services/SidebarService';
import { CacheManager } from '../services/CacheManager';
import { IGlobalConfig } from '../interfaces/config';
import { GlobalConfig } from './config';

const myContainer = new Container();
myContainer.bind<IGlobalConfig>(TYPES.IGlobalConfig).toConstantValue(GlobalConfig);

myContainer.bind<IOfflineService>(TYPES.IOfflineService).to(OfflineService).inSingletonScope();
myContainer.bind<ILocalStorageService>(TYPES.ILocalStorageService).to(LocalStorageService).inSingletonScope();
myContainer.bind<ISidebarService>(TYPES.ISidebarService).to(SidebarService).inSingletonScope();
myContainer.bind<ISettingsService>(TYPES.ISettingsService).to(SettingsService).inSingletonScope();
myContainer.bind<IModalService>(TYPES.IModalService).to(ModalService).inSingletonScope();
myContainer.bind<IServiceFactory>(TYPES.IServiceFactory).to(ServiceFactory).inSingletonScope();
myContainer.bind<ICacheManager>(TYPES.ICacheManager).to(CacheManager).inSingletonScope();

export { myContainer };
