interface DateModifier {
    year?: number;
    month?: number;
    day?: number;
}

interface DateInfo {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
}

interface DateMap extends DateInfo {
    currentDay: number;
    firstDay: number;
    prevMonthLastDay: number;
    monthLastDay: number;
    lastDay: number;
}

export function betweenDate<T = Date>(dates: (string | T)[]): T;
export function toDate<T = Date>(input?: string | T): T;
export function date2MysqlDate<T = Date>(input: string | T): string;
export function mysqlDate2Date<T = Date>(input: string): T;
export function deltaDate<T = Date>(input: string | T, modifier: DateModifier): T;
export function setDate<T = Date>(input: string | T,  day?: number, month?: number, year?: number): T;
export function setTime<T = Date>(input: string | T,  hour?: number, min?: number, sec?: number): T;
export function getMonthInfo<T = Date>(input?: string | T): DateMap;
export function to2digit(n: number, len: number): string;