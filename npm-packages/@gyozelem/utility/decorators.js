
export const classAutobind = (t, exclude = []) => {
    const prototype = t.constructor.prototype;
    Object.getOwnPropertyNames(prototype)
        .filter((key) => (typeof prototype[key] === 'function') && key !== 'constructor')
        .filter((key) => !~exclude.indexOf(key))
        .forEach((key) => t[key] = t[key].bind(t));
}
