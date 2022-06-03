type Instance = any;

export declare class Injector {
    automatedInjector: boolean;
    circularCheck: boolean;
    verboseLog: boolean;
    singletonConstructors: Map<string, Function>;
    instantiatedSingletons: Map<string, Instance>;
    injectionMap: Set<string>;

    enableAutomatedInjection: () => void;
    disableAutomatedInjection: () => void;
    isSingletonRegistered: (dependencyId: string) => boolean;
    isSingletonInstantiated: (dependencyId: string) => boolean;

    setDevelopmentMode: () => void;
    setProductionMode: () => void;
    registerSingleton: (dependencyId: string, singleton: Instance) => void;
    makeConstructorInjectable: (origConstructor: Function) => Instance;
    instantiateSingleton: (dependencyId: string) => Instance;
    resolvePropertyDependencies: (constructorName: string, obj: Record<string, any>, injections: string[]) => void;
  
    InjectableClass: () => (origConstructor: Function) => Instance;
    InjectableSingleton: (dependencyId: string) => (target: Function) => void;
    InjectProperty: (dependencyId: string) => (prototype: any, propertyName: string) => void;
}

export default new Injector();