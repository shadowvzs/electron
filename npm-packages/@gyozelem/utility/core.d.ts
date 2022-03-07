export function guid(): string;
export function delayPromise(sec: number): Promise<number>;
export function betweenNr(value: number, [min, max]: [number, number]);

export function getDeepProp<T = any>(obj: Record<string, any>, keys: string, fallback?: any): T;

export function deepClone<T = any>(source: T): T;
