export class Injector {
    constructor() {
        this.automatedInjector = true;
        this.circularCheck = true;
        this.verboseLog = location.href.includes('localhost');
        this.singletonConstructors = new Map();
        this.instantiatedSingletons = new Map();
        this.injectionMap = new Set();
        this.injectMapKey = Symbol('inject-map');

        this.enableAutomatedInjection = this.enableAutomatedInjection.bind(this);
        this.disableAutomatedInjection = this.disableAutomatedInjection.bind(this);
        this.isSingletonRegistered = this.isSingletonRegistered.bind(this);
        this.isSingletonInstantiated = this.isSingletonInstantiated.bind(this);
    
        this.setDevelopmentMode = this.setDevelopmentMode.bind(this);
        this.setProductionMode = this.setProductionMode.bind(this);
        this.registerSingleton = this.registerSingleton.bind(this);
        this.makeConstructorInjectable = this.makeConstructorInjectable.bind(this);
        this.instantiateSingleton = this.instantiateSingleton.bind(this);
        this.resolvePropertyDependencies = this.resolvePropertyDependencies.bind(this);
      
        this.InjectableClass = this.InjectableClass.bind(this);
        this.InjectableSingleton = this.InjectableSingleton.bind(this);
        this.InjectProperty = this.InjectProperty.bind(this);
    }

    enableAutomatedInjection() { this.automatedInjector = true; }
    disableAutomatedInjection() { this.automatedInjector = false; }
    isSingletonRegistered(dependencyId) { return this.singletonConstructors.has(dependencyId); }
    isSingletonInstantiated(dependencyId) { return this.instantiatedSingletons.has(dependencyId); }
    InjectableClass() { return this.makeConstructorInjectable; }
    
    setDevelopmentMode() {
        this.circularCheck = false;
        this.verboseLog = false;
    }

    setProductionMode() {
        this.circularCheck = false;
        this.verboseLog = false;
    }

    registerSingleton(dependencyId, singleton) {
        if (this.verboseLog) { console.info("@@@@ Manually registered singleton: " + dependencyId); }
        this.instantiatedSingletons.set(dependencyId, singleton);
    }

    makeConstructorInjectable(origConstructor) {
        if (this.verboseLog) { console.info("@@@@ Making constructor injectable: " + origConstructor.name); }    
        if (!origConstructor.prototype[this.injectMapKey]) { origConstructor.prototype[this.injectMapKey] = []; }
        const self = this;
        const proxyHandler = {
            construct(target, args, newTarget) {                
                if (self.verboseLog) { console.info("++++ Proxy constructor for injectable class: " + origConstructor.name); }
                const obj = Reflect.construct(target, args, newTarget);    
                if (!self.automatedInjector) { return obj; }
                try {
                    self.resolvePropertyDependencies(origConstructor.name, obj, origConstructor.prototype[self.injectMapKey]);
                } catch (err) {
                    console.error(`Failed to construct ${origConstructor.name} due to exception thrown by ${self.resolvePropertyDependencies.name}.`);
                    throw err;
                }                  
                return obj;
            }
        };
        return new Proxy(origConstructor, proxyHandler);
    }

    instantiateSingleton(dependencyId) {
        if (this.verboseLog) { console.info("<<< Requesting singleton: " + dependencyId); }
        try {
            const existingSingleton = this.instantiatedSingletons.get(dependencyId);
            if (existingSingleton) {
                if (this.verboseLog) { console.info("= Singleton already exists: " + dependencyId); }
                return existingSingleton;
            }        
            const singletonConstructor = this.singletonConstructors.get(dependencyId);
            if (!singletonConstructor) {
                const msg = "No constructor found for singleton " + dependencyId;
                console.error(msg);
                console.info("Available constructors: \r\n" + Array.from(this.singletonConstructors.entries()).map(entry => "\t" + entry[0] + " -> " + entry[1].name).join("\r\n"));
                throw new Error(msg);
            }        
            if (this.verboseLog) { console.info("= Lazily instantiating singleton: " + dependencyId); }
            const instantiatedSingleton = Reflect.construct(this.makeConstructorInjectable(singletonConstructor), []);
            this.instantiatedSingletons.set(dependencyId, instantiatedSingleton);
            if (this.verboseLog) { console.info("= Lazily instantiated singleton: " + dependencyId); }
            return instantiatedSingleton;
        } catch (err) {
            console.error("Failed to instantiate singleton " + dependencyId);
            console.error(err && err.stack || err);
            throw err;
        }
    }

    resolvePropertyDependencies(constructorName, obj, injections) {
        if (injections) {
            if (this.circularCheck) {
                if (this.injectionMap.has(constructorName)) { throw new Error(`${constructorName} has already been injected, this exception breaks a circular reference that would crash the app.`); }
                this.injectionMap.add(constructorName);
            }    
            try {    
                for (const [propertyName, dependencyId] of injections) {                 
                    if (this.verboseLog) { console.info(">>>> Injecting " + dependencyId); }        
                    const singleton = this.instantiateSingleton(dependencyId);
                    if (!singleton) { throw new Error("Failed to instantiate singleton " + dependencyId); }
                    obj[propertyName] = singleton;
                }
            } finally {
                if (this.circularCheck) { this.injectionMap.delete(constructorName); }
            }
        }
    }

    InjectableSingleton(dependencyId) {
        if (this.verboseLog) { console.info("@@@@ Registering singleton " + dependencyId); }
        return (target) => {
            if (this.verboseLog) { console.info("@@@@ Caching constructor for singleton: " + dependencyId); }
            this.singletonConstructors.set(dependencyId, target);
        }
    }

    InjectProperty(dependencyId) {
        return (prototype, propertyName) => {
            if (this.verboseLog) { console.info("@@@@ Setup to inject " + dependencyId + " to property " + propertyName + " in " + prototype.constructor.name); }
            if (!prototype[this.injectMapKey]) { prototype[this.injectMapKey] = []; }
            prototype[this.injectMapKey].push([propertyName, dependencyId]);
        };
    }
}

export default new Injector();