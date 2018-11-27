import { userService } from './KeeperService';
import * as request from 'superagent';
import { IHash } from '../../interfaces';


export const enum STATUSES {
    OK = 'ok',
    EMPTY = 'empty',
    ERROR = 'error'
}

const enum DATA_TRANSACTION_FIELD_TYPE {
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    STRING = 'string',
    BINARY = 'binary'
}

const enum ORACLE_RESERVED_FIELDS {
    NAME = 'oracle_name',
    SITE = 'oracle_site',
    LOGO = 'oracle_logo',
    MAIL = 'oracle_mail',
    DESCRIPTION = 'oracle_description',
    LANG_LIST = 'oracle_lang_list'
}

const NODE_URL = 'https://nodes.wavesplatform.com';

class DataTransactionService {

    public getOracleInfo(address: string): Promise<IServiceResponse<IOracleInfo>> {
        return DataTransactionService._getDataTxFields(address)
            .then(DataTransactionService._toHash)
            .then(hash => {
                const api = DataTransactionService._createResponseHash(hash);

                api.addString(ORACLE_RESERVED_FIELDS.NAME, 'name');
                api.addString(ORACLE_RESERVED_FIELDS.SITE, 'site');
                api.addString(ORACLE_RESERVED_FIELDS.MAIL, 'mail');
                api.add(ORACLE_RESERVED_FIELDS.DESCRIPTION);

                return api.toResponse();
            });
    }

    public setOracleInfo(info: IAssetInfo, address: string): Promise<string> {

    }

    public getAssetsList(address: string): Promise<IAssetInfo> {

    }

    public setAsset(address: string, asset: IAssetInfo): Promise<string> {

    }

    private static _getDataTxFields(address: string): Promise<Array<TField>> {
        return new Promise((resolve, reject) =>
            request.get(`${NODE_URL}/addresses/data/${address}`)
                .then(resolve as any)
                .catch(reject));
    }

    private static _toHash(list: Array<TField>): IHash<TField> {
        return list.reduce(DataTransactionService._addValue, Object.create(null));
    }

    private static _addValue(acc: IHash<TField>, item: TField): IHash<TField> {
        acc[item.key] = item;
        return acc;
    }

    private static _getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.STRING): string | null;
    private static _getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.BINARY): string | null;
    private static _getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.BOOLEAN): boolean | null;
    private static _getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE.INTEGER): number | null;
    private static _getField(hash: IHash<TField>, key: string, type: DATA_TRANSACTION_FIELD_TYPE): any {
        const item = hash[key];
        if (!item) {
            return null;
        }

        if (item.type !== type) {
            throw new Error(`Wrong field type! Key "${key}" is not a "${type}"!`);
        }

        return item.value;
    }

    private static _createResponseHash(hash: IHash<TField>) {
        const result = {
            data: Object.create(null),
            status: STATUSES.OK,
            errors: [] as Array<IError>
        };
        const api = {
            add: <T>(targetKey: string, processor: IAddFunction<T>) => {
                try {
                    const value = processor(hash);
                    result.data[targetKey] = value;
                } catch (error) {
                    result.status = STATUSES.ERROR;
                    result.errors.push({
                        key: targetKey,
                        error
                    });
                }
                return api;
            },
            addString: (from: string, to: string) => api.add(to, (hash => DataTransactionService._getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.STRING))),
            addBinary: (from: string, to: string) => api.add(to, (hash => DataTransactionService._getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.BINARY))),
            addNumber: (from: string, to: string) => api.add(to, (hash => DataTransactionService._getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.INTEGER))),
            addBoolean: (from: string, to: string) => api.add(to, (hash => DataTransactionService._getField(hash, from, DATA_TRANSACTION_FIELD_TYPE.BOOLEAN))),
            toResponse: () => {
                const isAllEmpty = Object.keys(result.data).every(name => result.data[name] === null);
                if (isAllEmpty) {
                    result.status = STATUSES.EMPTY;
                }
                return result;
            }
        };

        return api;
    }

}

export const dataTransactionService = new DataTransactionService();

export interface IOracleInfo {
    name: string;
    site: string;
    mail: string;
    description: IHash<string>;
    logo?: string;
}

export interface IAssetInfo {

}

export interface IError {
    key: string;
    error: Error;
}

export interface IServiceResponse<T> {
    status: STATUSES;
    data: T,
    errors: Array<IError>;
}

type TField =
    IDataTransactionFieldString |
    IDataTransactionFieldNumber |
    IDataTransactionFieldBoolean |
    IDataTransactionFieldBinary;

interface IDataTransactionFieldString {
    type: DATA_TRANSACTION_FIELD_TYPE.STRING;
    key: string;
    value: string;
}

interface IDataTransactionFieldNumber {
    type: DATA_TRANSACTION_FIELD_TYPE.INTEGER;
    key: string;
    value: number;
}

interface IDataTransactionFieldBoolean {
    type: DATA_TRANSACTION_FIELD_TYPE.BOOLEAN;
    key: string;
    value: boolean;
}

interface IDataTransactionFieldBinary {
    type: DATA_TRANSACTION_FIELD_TYPE.BINARY;
    key: string;
    value: string;
}

interface IAddFunction<T> {
    (acc: IHash<TField>): T;
}
