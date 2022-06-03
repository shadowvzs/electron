export function plainToClass<T = any>(entity: Partial<T>, ClassType: new () => T): T;
export function Type<T extends Object>(cb: () => T): <P extends Object>(target: P, property: string) => void;
