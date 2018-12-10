import { equals, uniq } from 'ramda';


export function omit<T extends object, K extends keyof T>(target: T, ...omitKeys: K[]): Omit<T, K> {
    return (Object.keys(target) as K[]).reduce(
        (res, key) => {
            if (!omitKeys.includes(key)) {
                res[key] = target[key];
            }
            return res;
        },
        {} as any
    );
}

export function getDiff<T extends object>(from: T, to: T): Partial<T> {
    const diff = Object.create(null);

    const leftKeys = Object.keys(from) as Array<keyof T>;
    const rightKeys = Object.keys(to) as Array<keyof T>;

    uniq([...leftKeys, ...rightKeys]).forEach(key => {
        if (!equals(from[key], to[key])) {
            diff[key] = to[key];
        }
    });

    return diff;
}
