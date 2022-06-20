function objFor(obj, cb) {
    let k;
    for (k in obj) cb(k, obj[k]);
}

const typeSymbol = Symbol('type');

function getBaseTypes(objInstance, types = {}) {
    const constructor = objInstance.constructor;
    if (constructor[typeSymbol]) {
        objFor(constructor[typeSymbol], (key, value) => {
            types[key] = value;
        });
    }
    
    const base = Object.getPrototypeOf(constructor);
    if (base.name) {
        return getBaseTypes(base, types);
    }
    return types;
}

function getValue(SubType, value) {
    // date handling
    if (typeof SubType['parse'] === 'function' && !(value instanceof SubType)) {
        value = SubType['parse'](value);
        if (
            !value || 
            typeof value === 'number' && isNaN(value)
        ) { return; }
        return new SubType(value);
    }
    // normal
    return plainToClass(value, SubType);
}

export const plainToClass = (entity, ClassType) => {
    const instance = new ClassType();
    objFor(entity, (key, value) => {
        const types = getBaseTypes(instance);
        if (value === null) { return; }
        if (types && types[key]) {
            const SubType = types[key];
            if (SubType.prototype) {
                if (Array.isArray(value)) {
                    value = value.map(x => getValue(SubType, x));
                } else {
                    value = getValue(SubType, value);
                }
            }
        }
        instance[key] = value;        
    });
    return instance;
}

export function Type(cb) {
    return function(target, property) {
        const types = target.constructor[typeSymbol] || {}
        types[property] = cb();
        target.constructor[typeSymbol] = types;
    };
}

