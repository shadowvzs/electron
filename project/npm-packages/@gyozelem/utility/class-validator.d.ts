export const validatorData: {
    TYPE: {
        EMAIL: (x: string) => boolean,
        NAME_HUN: (x: string) => boolean,
        ADDRESS_HUN: (x: string) => boolean,
        NAME: (x: string) => boolean,
        INTEGER: (x: string) => boolean,
        SLUG: (x: string) => boolean,
        URL: (x: string) => boolean,
        ALPHA_NUM: (x: string) => boolean,
        STR_AND_NUM: (x: string) => boolean,
        LOWER_UPPER_NUM: (x: string) => boolean,
        LOWER_UPPER_NUM_SYMBOL: (x: string) => boolean,
        MYSQL_DATE: (x: string) => boolean,
        STRING: (x: string) => boolean,
        BLOB: (x: Blob) => boolean,
        JSON: (x: string) => boolean,
    },
    LENGTH: {
        MIN: (x: string, len1: number) => boolean,
        MAX: (x: string, len1: number) => boolean,
        MIN_MAX: (x: string, len1: number, len2?: number) => boolean
    },
    REQUIRED: (x: string) => boolean,
    MATCH: (x: string, y: string) => boolean,
    EGUAL: (x: string,  o: any, y: string) => boolean,
    REVALIDATE: (x: string,  o: any, y: string) => boolean,
}

export type IVCondition<T> = (x: string, o?: T) => boolean;
export type ValidationCondition<T> = (x: any, o?: T) => false | IValidationError;
export type IValidatorOption<T> = any[] | IVCondition<T>;
export interface IValidationError {
    type: string;
    message: string;
}

export function deepClone<T = any>(source: T): T;

export function validator<T>(rule: string, message: string, options: IValidatorOption<T>): ValidationCondition<T>;

export const validationKey: symbol;

export type ValidationData<T> = {
    rule: string;
    message: string;
    options: IValidatorOption<T>;
    validator: ValidationCondition<T>;
}
export type ValidationMap<T> =  Map<string, Set<ValidationData<T>>>;

export function CV<T>(rule: ValidationData<T>['rule'], message: ValidationData<T>['message'], options?: ValidationData<T>['options']): any;