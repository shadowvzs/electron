class ServiceContainer {
    private serviceMap: Map<string, { cls: new (t: any) => any, params: Record<string, any> }> = new Map();
    private instanceMap: Map<string, any> = new Map();

    public register = <T>(c: new () => T,) => {

    }
};

const a = new ServiceContainer();

a.register<ServiceContainer>(ServiceContainer)