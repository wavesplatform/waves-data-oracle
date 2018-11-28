import { IHash } from '../../../../interfaces';
import {
    STATUSES,
    IServiceResponse,
    IAssetInfo,
    TField,
    ORACLE_RESERVED_FIELDS,
    ORACLE_ASSET_FIELD_PATTERN, PATTERNS
} from '../';
import * as request from 'superagent';
import { DATA_TRANSACTION_FIELD_TYPE, DEFAULT_LANG } from '../constants';


const NODE_URL = 'https://nodes.wavesplatform.com';

export function getLangList(hash: IHash<TField>): Array<string> {
    const item = hash[ORACLE_RESERVED_FIELDS.LANG_LIST] && hash[ORACLE_RESERVED_FIELDS.LANG_LIST] || null;
    if (!item || item.type !== DATA_TRANSACTION_FIELD_TYPE.STRING || !item.value) {
        return [DEFAULT_LANG];
    } else {
        return item.value.split(',');
    }
}

export function getAssetListFromHash(hash: IHash<TField>): Array<IServiceResponse<IAssetInfo>> {
    const result: Array<IServiceResponse<IAssetInfo>> = [];
    const langList = getLangList(hash);

    Object.keys(hash).forEach(key => {

        const id = getAssetIdFromStatusKey(key);

        if (!id) {
            return;
        }

        const api = createResponseHash<IAssetInfo>(hash);

        api.put('id', id);
        api.addNumber(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.STATUS, id), 'status');
        api.addBinary(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.LOGO, id), 'logo');
        api.addString(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.SITE, id), 'site');
        api.addString(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.TICKER, id), 'ticker');
        api.addString(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.EMAIL, id), 'email');
        langList.forEach(lang => {
            const field = getDescriptionField(id, lang);
            api.addToHash('description', lang, hash => getField(hash, field, DATA_TRANSACTION_FIELD_TYPE.STRING));
        });

        result.push(api.toResponse());

    });

    return result;
}

export function getDataTxFields(address: string): Promise<Array<TField>> {
    return new Promise((resolve, reject) =>
        request.get(`${NODE_URL}/addresses/data/${address}`)
            .then(resolve as any)
            .catch(reject));
}

export function toHash<T extends keyof R, R>(key: T): (list: Array<R>) => IHash<R> {
    return list => list.reduce((acc, item) => {
        acc[item[key]] = item;
        return acc;
    }, Object.create(null));
}

export function createResponseHash<T>(hash: IHash<TField>): ICreateResponseAPI<T> {
    const result = {
        data: Object.create(null),
        status: STATUSES.OK,
        errors: Object.create(null)
    };

    const hashes = Object.create(null);

    const addError = (key: string, error: Error) => {
        result.status = STATUSES.ERROR;
        result.errors[key] = error;
    };

    const api: ICreateResponseAPI<any> = {
        add: <T>(targetKey: string, processor: IAddFunction<T>) => {
            try {
                const value = processor(hash);
                result.data[targetKey] = value;
            } catch (error) {
                result.data[targetKey] = null;
                addError(targetKey, error);
            }
        },
        addToHash: <T>(targetKey: string, hashKey: string, processor: IAddFunction<T>) => {
            hashes[targetKey] = true;
            try {
                const value = processor(hash);
                if (!result.data[targetKey]) {
                    result.data[targetKey] = Object.create(null);
                }
                result.data[targetKey][hashKey] = value;
            } catch (error) {
                result.data[targetKey][hashKey] = null;
                addError(`${targetKey}.${hashKey}`, error);
            }
        },
        put: (targetKey: string, value: any) => {
            result.data[targetKey] = value;
            return api;
        },
        read: (from: string, type: DATA_TRANSACTION_FIELD_TYPE, callback: ICallback<any>) => {
            try {
                const value = getField(hash, from, type);
                callback(value);
            } catch (error) {
                addError(from, error);
            }
        },
        readString: (from: string, callback: ICallback<string | null>) => api.read(from, DATA_TRANSACTION_FIELD_TYPE.STRING, callback),
        readBinary: (from: string, callback: ICallback<string | null>) => api.read(from, DATA_TRANSACTION_FIELD_TYPE.BINARY, callback),
        readNumber: (from: string, callback: ICallback<number | null>) => api.read(from, DATA_TRANSACTION_FIELD_TYPE.INTEGER, callback),
        readBoolean: (from: string, callback: ICallback<boolean | null>) => api.read(from, DATA_TRANSACTION_FIELD_TYPE.BOOLEAN, callback),
        addString: (from: string, to: string) => api.add(to, (hash => getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.STRING))),
        addBinary: (from: string, to: string) => api.add(to, (hash => getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.BINARY))),
        addNumber: (from: string, to: string) => api.add(to, (hash => getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.INTEGER))),
        addBoolean: (from: string, to: string) => api.add(to, (hash => getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.BOOLEAN))),
        toResponse: () => {

            Object.keys(hashes).forEach(key => {
                if (isEmpty(result.data[key])) {
                    result.data[key] = null;
                }
            });

            if (isEmpty(result.data)) {
                result.status = STATUSES.EMPTY;
            }
            return result;
        }
    };

    return api;
}

export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.STRING): string | null;
export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.BINARY): string | null;
export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.BOOLEAN): boolean | null;
export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.INTEGER): number | null;
export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE): string | boolean | number | null;
export function getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE): any {
    const item = hash[key];
    if (!item) {
        return null;
    }

    if (item.type !== type) {
        throw new Error(`Wrong field type! Key "${key}" is not a "${type}"!`);
    }

    return item.value;
}

export function getOracleDescriptionKey(lang: string) {
    return `${ORACLE_RESERVED_FIELDS.DESCRIPTION}_${lang}`;
}

export function isEmpty(hash: IHash<any>): boolean {
    return Object.keys(hash).every(name => hash[name] === null);
}

function getAssetIdFromStatusKey(key: string): string | null {
    const start = ORACLE_ASSET_FIELD_PATTERN.STATUS.replace(PATTERNS.ASSET_ID, '');
    if (key.indexOf(start) !== 0) {
        return null;
    }
    const id = (key.match(/<(.+)?>/) || [])[1];

    return id || null;
}

export function replaceAssetID(key: string, id: string): string {
    return key.replace(PATTERNS.ASSET_ID, `<${id}>`);
}

export function getDescriptionField(id: string, lang: string): string {
    return replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.DESCRIPTION, id).replace(PATTERNS.LANG, `<${lang}>`);
}

export interface ICallback<T> {
    (param: T): void;
}

export interface ICreateResponseAPI<R> {
    add<T>(targetKey: keyof R, processor: IAddFunction<T>): void;

    addToHash<T>(targetKey: keyof R, hashKey: string, processor: IAddFunction<T>): void;

    put(targetKey: keyof R, value: any): void;

    read(from: string, type: DATA_TRANSACTION_FIELD_TYPE, callback: ICallback<string | boolean | number | null>): void;

    read(from: string, type: DATA_TRANSACTION_FIELD_TYPE.STRING, callback: ICallback<string | null>): void;

    read(from: string, type: DATA_TRANSACTION_FIELD_TYPE.BOOLEAN, callback: ICallback<boolean | null>): void;

    read(from: string, type: DATA_TRANSACTION_FIELD_TYPE.BINARY, callback: ICallback<string | null>): void;

    read(from: string, type: DATA_TRANSACTION_FIELD_TYPE.INTEGER, callback: ICallback<number | null>): void;

    readString(from: string, callback: ICallback<string | null>): void;

    readBinary(from: string, callback: ICallback<string | null>): void;

    readNumber(from: string, callback: ICallback<number | null>): void;

    readBoolean(from: string, callback: ICallback<boolean | null>): void;

    addString(from: string, to: keyof R): void;

    addBinary(from: string, to: keyof R): void;

    addNumber(from: string, to: keyof R): void;

    addBoolean(from: string, to: keyof R): void;

    toResponse(): IServiceResponse<R>;
}

interface IAddFunction<T> {
    (acc: IHash<TField>): T;
}
