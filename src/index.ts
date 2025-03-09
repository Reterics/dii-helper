import * as d3 from 'd3';

export interface FlareData {
    name: string;
    children: FlareData[];
}

/**
 * Dii-Helper
 * A utility library for D3.js to simplify hierarchical data structuring.
 */
const DiiHelper = {
    children: 'children',
    name: 'name',

    nestForD3: () => {
        const map = d3.group;

        function createObject() {
            return {};
        }

        function setObject(object: Record<string, any>, name: string, value: unknown) {
            object[name] = value;
        }

        function createMap() {
            return new Map();
        }

        function setMap(map: Map<unknown, unknown>, name: string, value: unknown) {
            map.set(name, value);
        }

        let names: ((d: unknown) => string)[] = [],
            sortKeys: ((a: string, b: string) => number)[] = [],
            sortValues: ((a: unknown, b: any) => number) | null = null,
            rollup: ((values: any[]) => any) | null = null,
            nest: any;

        function apply(array: any[], depth: number, createResult: Function, setResult: Function) {
            if (depth >= names.length) {
                if (sortValues) array.sort(sortValues);
                return rollup ? rollup(array) : array;
            }

            const name = names[depth++];
            const childrenByKey = new Map();

            for (const value of array) {
                const key = name(value) + '';
                if (!childrenByKey.has(key)) {
                    childrenByKey.set(key, []);
                }
                childrenByKey.get(key).push(value);
            }

            const result = createResult();
            for (const [key, children] of childrenByKey.entries()) {
                setResult(result, key, apply(children, depth, createResult, setResult));
            }

            return result;
        }

        function entries(map: Map<string, any>, depth: number) {
            if (++depth > names.length) return map;
            let array: FlareData[] = Array
                .from(map.entries())
                .map(([name, children]) => ({ name, children: entries(children, depth) })) as FlareData[];
            return sortKeys[depth - 1] ? array.sort((a, b) => sortKeys[depth - 1](a.name, b.name)) : array;
        }

        return (nest = {
            object: (array: any[]) => apply(array, 0, createObject, setObject),
            map: (array: any[]) => apply(array, 0, createMap, setMap),
            entries: (array: any[]) => entries(apply(array, 0, createMap, setMap), 0),
            key: (d: (d: any) => string) => (names.push(d), nest),
            sortKeys: (order: (a: string, b: string) => number) => (sortKeys[names.length - 1] = order, nest),
            sortValues: (order: (a: any, b: any) => number) => ((sortValues = order), nest),
            rollup: (f: (values: any[]) => any) => ((rollup = f), nest),
        });
    },

    nestKeys: (data: any[], keys: string[]) => {
        const nest = DiiHelper.nestForD3();
        keys.forEach((key) => nest.key((d) => d[key]));
        return nest.entries(data);
    },
};

export default DiiHelper;
