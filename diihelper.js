/**
 * Dii-Helper
 * https://www.npmjs.com/package/dii-helper
 * by Attila Reterics based on D3.nest
 *
 * D3 page: https://d3js.org
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.DiiHelper = global.DiiHelper || {}));
}(this, function (exports) {
    if( !window.d3) {
        throw 'D3 is not defined';
    }

    const DiiHelper = {
        children:'children',
        name:'name',
        nestForD3: () => {
            const map = d3.map;

            function createObject() {
                return {};
            }

            function setObject(object, name, value) {
                object[name] = value;
            }

            function createMap() {
                return map();
            }

            function setMap(map, name, value) {
                map.set(name, value);
            }

            var names = [],
                sortKeys = [],
                sortValues,
                rollup,
                nest;

            function apply(array, depth, createResult, setResult) {
                if (depth >= names.length) {
                    if (sortValues != null) array.sort(sortValues);
                    return rollup != null ? rollup(array) : array;
                }

                var i = -1,
                    n = array.length,
                    name = names[depth++],
                    nameValue,
                    value,
                    childrenByKey = map(),
                    children,
                    result = createResult();

                while (++i < n) {
                    if (children = childrenByKey.get(nameValue = name(value = array[i]) + "")) {
                        children.push(value);
                    } else {
                        childrenByKey.set(nameValue, [value]);
                    }
                }

                childrenByKey.each(function(children, name) {
                    setResult(result, name, apply(children, depth, createResult, setResult));
                });

                return result;
            }

            function entries(map, depth) {
                if (++depth > names.length) return map;
                var array, sortKey = sortKeys[depth - 1];
                if (rollup != null && depth >= names.length) array = map.entries();
                else array = [], map.each(function(v, k) { array.push({name: k, children: entries(v, depth)}); });
                return sortKey != null ? array.sort(function(a, b) { return sortKey(a.name, b.name); }) : array;
            }

            return nest = {
                object: function(array) { return apply(array, 0, createObject, setObject); },
                map: function(array) { return apply(array, 0, createMap, setMap); },
                entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
                key: function(d) { names.push(d); return nest; },
                sortKeys: function(order) { sortKeys[names.length - 1] = order; return nest; },
                sortValues: function(order) { sortValues = order; return nest; },
                rollup: function(f) { rollup = f; return nest; }
            };
        },
        maxInFlare: (flare, keyName) => {
            const children = DiiHelper.children;

            const goDeeper = (flare, keyName) => {
                if(flare && typeof flare[keyName] === 'number'){
                    return flare[keyName];
                }else if(flare && Array.isArray(flare[children])){
                    let max = 0;
                    flare[children].forEach(d => {
                        if(d){
                            const number = goDeeper(d,keyName);
                            if(number > max){
                                max = number;
                            }
                        }
                    });
                    return  max;
                }else if(flare && flare.data){
                    return goDeeper(flare.data,keyName);
                }else{
                    return null;
                }
            };
            return goDeeper(flare,keyName)
        },
        firstInFlare: (flare, keyName) => {
            const children = DiiHelper.children;

            const goDeeper = (flare, keyName) => {
                if(flare && typeof flare[keyName] === 'number'){
                    return flare[keyName];
                }else if(flare && Array.isArray(flare[children])){
                    let max = 0;
                    flare[children].forEach((d,i) => {
                        if(d && !i){
                            max = goDeeper(d,keyName);
                        }
                    });
                    return  max;
                }else if(flare && flare.data){
                    return goDeeper(flare.data,keyName);
                }else{
                    return null;
                }
            };
            return goDeeper(flare,keyName)
        },
        lastInFlare: (flare, keyName) => {
            const children = DiiHelper.children;

            const goDeeper = (flare, keyName) => {
                if(flare && typeof flare[keyName] === 'number'){
                    return flare[keyName];
                }else if(flare && Array.isArray(flare[children])){
                    let max = 0;
                    const size = flare[children].length;
                    flare[children].forEach((d,i) => {
                        if(d && i === size - 1){
                            max = goDeeper(d,keyName);
                        }
                    });
                    return  max;
                }else if(flare && flare.data){
                    return goDeeper(flare.data, keyName);
                } else {
                    return null;
                }
            };
            return goDeeper(flare,keyName)
        },
        nestKeys: (data, array) => {
            const nest = DiiHelper.nestForD3();
            array.forEach(a => {
                nest.key(d => d[a]);
            });
            return nest.entries(data);
        }
    };

    exports.children = DiiHelper.children;
    exports.name = DiiHelper.name;
    exports.nestForD3 = DiiHelper.nestForD3;
    exports.maxInFlare = DiiHelper.maxInFlare;
    exports.firstInFlare = DiiHelper.firstInFlare;
    exports.lastInFlare = DiiHelper.lastInFlare;
    exports.nestKeys = DiiHelper.nestKeys;

Object.defineProperty(exports, '__esModule', { value: true });

}));