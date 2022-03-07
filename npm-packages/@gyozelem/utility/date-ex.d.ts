interface DateObject { 
    day: number;
    month: number;
    year: number;
    hour: number;
    min: number;
    sec: number;    
}

export declare class DateEx extends Date {
    toMySQLDate(): string;
    isBefore(target: DateEx): boolean;
    isAfter(target: DateEx): boolean;
    clone(): DateEx;
    getObjectForm(): DateObject;
    add(modifier: Partial<Record<keyof DateObject, number>>): DateEx;
    substract(modifier: Partial<Record<keyof DateObject, number>>): DateEx;
    set(modifier: Partial<Record<keyof DateObject, number>>): DateEx;
}
