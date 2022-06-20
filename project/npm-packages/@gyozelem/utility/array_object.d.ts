export interface ITreeObject<T> {
    id: number | string;
    parent: ITreeObject<T>;
    childs: ITreeObject<T>[];
    item: T;
}

export type TreeKey = number | string;

export interface IArrayValueMap<T = any> extends Array<T> {
    [key: number]: T;
    valueMap: Record<string, T>;
    length: number;
    push: (arg0: T) => number;
    add: (arg0: T) => void;
    remove: (arg0: string | number, arg1?: (string | number)[]) => (string | number)[];
    splice: (arg0: number, arg1: number, arg2?: T) => T[];
}

export interface IHierarchyMap<T = any> extends IArrayValueMap<T> {
    getParentIds: (itemId: TreeKey, until?: TreeKey) => TreeKey[];
    getParents: (itemId: TreeKey, until?: TreeKey) => T[];
    getChilds: (itemId: TreeKey) => T[];
    getChildIds: (itemId: TreeKey) => TreeKey[];
}

type IMapCb<T> = (arg0: T, arg1?: number) => any;
export type StrKeyOf<T> = Extract<keyof T, string>;
type IObjForCb<T> = (arg0: StrKeyOf<T>, arg1: Partial<T[keyof T]>) => void;
type IObjMapCb<T = any> = (arg0: T) => T;

// array related
export function sort<T>(list: T[], key: keyof T, direction: 'ASC' | 'DESC'): T[];
export function flat<T>(arr: T[] | T[][], depth: number): T[];
export function concat<T>(arr1: T, arr2: T[]): T[];
export function forEach<T>(arr: T[], cb: (item: T, index: number) => void): void;
export function map<T>(arr: any, cb: IMapCb<T>): any[];
export function toArray(obj: Record<string, any>): any[];
// tree and value map
export function arrayToMap(array: string[]): Record<string, string|number>;
export function array2ArrayMap<T>(data: T[], key?: 'id' | string): IArrayValueMap<T>;
export function array2Hierarchy<T>(data: T[], getId: (item: T) => TreeKey, getParentId: (item: T) => TreeKey, rootItem: T): IHierarchyMap<ITreeObject<T>>;
export function getPath<T>(items: IArrayValueMap<ITreeObject<T>>, activeId: TreeKey, rootId: TreeKey): TreeKey[];
// object related
export function objFor<T>(obj: T, cb: IObjForCb<T>): void;
export function objConcat<T, K>(obj1: T, obj2: K): T & K;
export function objMerge<T, K>(obj1: T, obj2: K): T & K;
export function objMap<T = any>(obj: Record<string, T>, cb: IObjMapCb): Record<string, T>;
export function objValues<T>(obj: Record<string, any>): T[];