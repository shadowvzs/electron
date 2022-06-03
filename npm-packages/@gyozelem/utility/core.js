export const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const delayPromise = sec => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(sec), sec * 1000);
    });
}

export const betweenNr = (value, [min, max]) => {
    return Math.max(Math.min(value, max), min);
}

export function getDeepProp(obj = {}, keys = '', fallback) {
    const key = keys.split('.');
    const max = key.length;
    let i = 0;
    for (; i < max && obj; i++) obj = obj[key[i]];
    return i === max && obj ? obj : fallback;
}

export function deepClone(source) {
    let outObject;

    if (typeof source !== "object" || source === null) {
        return source;
    }

    outObject = (Array.isArray(source) ? [] : {});
  
    for (let key in source) {
        outObject[key] = deepClone(source[key]);
    }
  
    return outObject;
}

