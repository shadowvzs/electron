interface IRelationship {
    source: string;
    target: string;
}

interface IRelationships {
    hasOne?: Record<string, IRelationship>;
    hasMany?: Record<string, IRelationship>;
}

interface IColumnData {
    autoIncrement?: boolean;
    index?: boolean;
    primaryKey?: boolean;
    unique?: boolean;
}

export type IStoreScheme = Record<string, IColumnData | IRelationships> & { __relationships?: IRelationships };
export type IFilter<T> = (item: T) => boolean
export type IDbScheme = Record<string, IStoreScheme>;

export declare class IDB {
    public static exists(dbName: string): Promise<boolean>;
    public connected: boolean;
    public connection: IDB;
    public stores: Record<string, IndexDBStore>;
    constructor(
        public name: string, 
        public dbScheme: IDbScheme, 
        public version: number
    );
    public connect(): Promise<IDB>;
    public hasStore(name: string): Promise<boolean>;
    public loadStore(name: string, scheme?: IStoreScheme): IDBStore;
    public dropDatabase(): Promise<void>;
    public disconnect(): Promise<IDB>;
}

export declare class IDBStore<T = any> {
    public static getKeyRange(filter: [any, any]): IDBKeyRange;

    constructor(
        public db: IndexDBDatabase, 
        public name: string,
        public scheme: IStoreScheme
    );
    public getRelationshipPromise(item: T, promiseList: Promise<any>[], relationType: 'hasOne' | 'hasMany', depth?: number): Promise<T>;
    public getItemWithRelattions(itemPromise: Promise<T | T[]>, depth: number): Promise<T | T[]> ;
    public getRelatedEntities(filter: IFilter<T>, depth?: number, limit?: number): Promise<T | T[]>;
    public getFirstJoin(filter: IFilter<T>, depth?: number): Promise<T | T[]>;
    public get(filter: IFilter<T>, limit?: number): Promise<T | T[]>;
    public getBetween(start: string | number, end: string | number, limit?: number): Promise<T | T[]>;
    public getFirst (filter: IFilter<T>): Promise<T | T[]>;
    public add(data: T, key?: keyof T): Promise<number | string>;
    public addMultiple(data: T[], key?: keyof T): Promise<void>;
    public update(data: T): Promise<number | string>;
    public delete(id: string | number): Promise<boolean>;
    public createStore(storeScheme?: IStoreScheme): IDBStore;
    public dropStore(): Promise<IDBStore>;
    public truncateStore(): Promise<IDBStore>;
    public openTransaction(type: 'read' | 'write' | 'readwrite'): [IDBTransaction, IDBObjectStore];
}