export function getDeepProp(obj = {}, keys = '', fallback) {
    const key = keys.split('.');
    const max = key.length;
    let i = 0;
    for (; i < max && obj; i++) obj = obj[key[i]];
    return i === max && obj ? obj : fallback;
}

export const validatorData = {
    TYPE: {
        EMAIL:                  x => new RegExp('^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$)$').test(x),
        NAME_HUN:               x => new RegExp('^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔ??áéíóöőúüűô??]+)$').test(x),
        ADDRESS_HUN:            x => new RegExp('^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔ??áéíóöőúüűô??\,\.\-]+)$').test(x),
        NAME:                   x => new RegExp('^([a-zA-Z0-9 \-]+)$').test(x),
        INTEGER:                x => new RegExp('^([0-9]+)$').test(x),
        SLUG:                   x => new RegExp('^[a-zA-Z0-9-_]+$').test(x),
        URL:                    x => new RegExp('^[a-zA-Z0-9-_]+$').test(x),
        ALPHA_NUM:              x => new RegExp('^([a-zA-Z0-9]+)$').test(x),
        STR_AND_NUM:            x => new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$').test(x),
        LOWER_UPPER_NUM:        x => (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])([A-Za-z\d]{6,})$/).test(x),
        LOWER_UPPER_NUM_SYMBOL: x => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).test(x),
        MYSQL_DATE:             x => new RegExp('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$').test(x),
        STRING:                 x => true,
        BLOB:                   x => true,
        JSON:                   x => {
                                    try {
                                        JSON.parse(x);
                                    } catch(err) {
                                        return false;
                                    }
                                    return true;
                                },
    },
    LENGTH: {
        MIN: (x, len1) => Boolean(x && x.length >= len1),
        MAX: (x, len1) => Boolean(x && x.length <= len1),
        MIN_MAX: (x, len1, len2) => Boolean(x && x.length >= len1 && len2 && x.length <= len2)
    },
    REQUIRED: (x) => Boolean(x),
    MATCH: (x, y) => x === y,
    EGUAL: (x,  o, y) => Boolean(y && x === o[y]),
    REVALIDATE: (x,  o, y) => { 
        console.info('re validate - x, o, y', x, o, y)
        /*
        const showText = o[FormSymbolKey]['showHelperText'];
        if (showText) {
            // reevalidate all validation on y property & show error if needed at that field
            o.validatorData(y, o[y]);   
            o[FormSymbolKey]['showHelperText'](y);
        }
        */
        return true; 
    },
}

export function validator(rule, message, options = []) {
    if (typeof options === 'function') {
        return (x, o) => !options(x, o) && ({
            type: rule,
            message: message
        });
    }
    const v = getDeepProp(validatorData, rule);
    if (v) {
        return (x, o) => {
            if (!rule.includes('.') && options[0] !== o) options.unshift(o);
            return !v(x, ...options) && ({
                type: rule,
                message: message
            });
        }
    }
    return () => false;
};

export const validationKey = Symbol('validation');

export function CV(rule, message, options = []) {
    return function (target, property, descriptor) {
        const targetParent = target.constructor;
        const map = targetParent[validationKey] || new Map();
        if (!targetParent[validationKey]) { targetParent[validationKey] = map; }
        const validations = map.get(property) || new Set();
        validations.add({
            rule,
            message,
            options,
            validator: validator(rule, message, options)
        });
        map.set(property, validations);
        return descriptor;
    };
}
