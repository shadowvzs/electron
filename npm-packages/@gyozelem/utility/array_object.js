
export const arrayToMap = array => {
    const obj = {};
    array.forEach((x, i) => {
        obj[x] = i;
        obj[i] = x;
    });
    return obj;
}

export function array2ArrayMap(data = [], key = 'id') {
    const result = new Array();
    result.length = data.length;
    result.valueMap = {};
    data.forEach((x, i) => {
        result[i] = x;
        result.valueMap[x[key]] = x;
    });
    result.add = function(item) {
        result.push(item);
        result.valueMap[item[key]] = item;
    }
    result.remove = function(id) {
        result.splice(result.findIndex(x => x[key] === id), 1);
        delete result.valueMap[id];
        return [id];
    }    
    return result;
}

export const TREE_ROOT_ID = '-1';
export function array2Hierarchy(data = [], getId, getParentId, rootItem) {
    const result = new Array();
    result.valueMap = {};

    result.add = function (item) {
        this.push(item);
        this.valueMap[item.id] = item;
        if (item.parent) {
            item.parent.childs.push(item)
        }
    };

    result.remove = function(id, childIds) {
        const rootItem = this.valueMap[id];
        if (rootItem.parent) {
            rootItem.parent.childs = rootItem.parent.childs.filter(x => x.id !== id);
        }
        const ids = childIds || result.getChildIds(id);
        const m = result.length - 1;
        let item;
        for (let i = m; i >= 0; i--) {
            item = this[i];
            if (~ids.indexOf(item.id)) {
                if (item.parent?.childs) {
                    const cIdx = item.parent?.childs.findIndex(x => ids.includes(x.id));
                    if (cIdx) { item.parent.childs.splice(cIdx, 1); }
                }
                delete this.valueMap[item.id];
                this.splice(i, 1);
            }
        }
        
        /*
        const m = result.length - 1;
        for (let i = m; i >= 0; i--) {
            if (~ids.indexOf(this[i].id)) {
                this.valueMap.remove(this[i].id);
                this.splice(i, 1);
            }
        }
        */
       
        return ids;
    }

    data.forEach((x) => {
        const id = getId(x);
        result.add({
            id: id,
            parent: null,
            childs: [],            
            item: x
        });
    });

    const root = {
        id: '00000000-0000-0000-0000-000000000000',
        parent: null,
        childs: [],
        item: rootItem
    };

    result.forEach(x => {
        
        const parentId = getParentId(x.item);
        
        if (parentId === root.id) { 
            x.parent = root;
            return root.childs.push(x);
        } else if (!parentId) {
            return;
        }

        const parent = result.valueMap[parentId];
        parent.childs.push(x);
        x.parent = parent;
    });

    result.valueMap[rootItem.id] = root;

    result.getParentIds = (itemId, until) => {
        return result.getParents(itemId, until).map(x => getId(x.item));
    }

    result.getParents = (itemId, until) => {
        const parents = [];
        let item = result.valueMap[itemId];
        let id;
        while (item) {
            id = getId(item.item);
            if (id === until) { break; }
            if (itemId !== id) {
                parents.push(item);                
            }
            item = item.parent;
        };
        return parents;
    };

    result.getChildIds = (itemId) => {
        const item = result.valueMap[itemId];
        if (!item) { return; }
        const keys = []
        keys.push(getId(item.item));
        item.childs.forEach(x => {
            keys.push(...result.getChildIds(x.id));
        });
        return keys;
    }

    result.getChilds = (itemId) => {
        return result.getChildIds(itemId).map(x => result.valueMap[x]).filter(Boolean);
    };

    return result;
}

export function getPath(items, activeId, rootId = TREE_ROOT_ID) {
    const ids = [];
    let parent;

    while (items.valueMap[activeId] && rootId !== activeId) {
        ids.push(activeId);

        parent = items.valueMap[activeId].parent;
        activeId = parent ? parent.id : null;
    }

    return ids;
}

export const sort = (list, key, direction = 'ASC') => {
    return list.sort((a, b) => (a && b) ? (a[key] > b[key] ? 1 : -1) * (direction === 'ASC' ? 1 : -1) : 0);
}


export function flat(arr, depth) {
    const arrLen = arr.length;
    const final = [];
    let i = 0;
    for(; i < arrLen; i++) {
        if (Array.isArray(arr[i])) {
            concat(final, depth ? flat(arr[i], depth - 1) : arr[i]);
        } else {
            final.push(arr[i]);
        }
    }
    return final;
}

export function concat(arr1, arr2) {
    const arr1Len = arr1.length;
    const arr2Len = arr2.length;
    let i = 0;
    arr1.length = arr1Len + arr2Len;
    for(; i < arr2Len; i++) arr1[arr1Len + i] = arr2[i];
    return arr1;
}

export function forEach(arr, cb) {
    const arrLen = arr.length;
    let i = 0;
    for(; i < arrLen; i++) cb(arr[i], i);
}

export function map(arr, cb) {
    const finalArray = [];
    const arrLen = arr.length;
    finalArray.length = arrLen;
    let i = 0;
    for(; i < arrLen; i++) finalArray[i] = cb(arr[i], i);
    return finalArray;
}

export function toArray(obj) {
    return Array.prototype.slice.call(obj);
}

// object related 

export function objFor(obj, cb) {
    let k;
    for (k in obj) cb(k, obj[k]);
}

export function objConcat(obj1, obj2) {
    const result = {};
    let key;
    for (key in obj1) result[key] = obj1[key];
    for (key in obj2) result[key] = obj2[key];
    return result;
}

export function objMerge(obj1, obj2) {
    if (!obj1) obj1 = {};
    let key;
    for (key in obj2) obj1[key] = obj2[key];
    return obj1;
}

export function objMap(obj, cb) {
    const result = {};
    let k;
    for (k in obj) result[k] = cb(obj[k]);
    return result;
}

export function objValues(obj) {
    const result = [];
    let k;
    for (k in obj) result.push(obj[k]);
    return result;
}