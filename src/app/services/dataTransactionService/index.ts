import {
    ORACLE_RESERVED_FIELDS,
    getDataTxFields,
    toHash,
    createResponseHash,
    getAssetListFromHash,
    getLangList,
    getOracleDescriptionKey,
    getField,
} from './utils';
import { STATUSES, DATA_TRANSACTION_FIELD_TYPE } from './constants'
import { IHash } from '../../../interfaces';

export * from './constants';


export function getOracleInfo(address: string, server?: string): Promise<IServiceResponse<IOracleInfo>> {
    return getDataTxFields(address, server)
        .then(toHash('key'))
        .then(hash => {
            const api = createResponseHash<IOracleInfo>(hash);

            api.addString(ORACLE_RESERVED_FIELDS.NAME, 'name');
            api.addString(ORACLE_RESERVED_FIELDS.SITE, 'site');
            api.addString(ORACLE_RESERVED_FIELDS.MAIL, 'mail');
            api.addBinary(ORACLE_RESERVED_FIELDS.LOGO, 'logo');
            getLangList(hash).forEach(lang => {
                const dataKey = getOracleDescriptionKey(lang);
                api.addToHash('description', lang, hash => getField(hash, dataKey, DATA_TRANSACTION_FIELD_TYPE.STRING));
            });

            return api.toResponse();
        });
}

export function getAssets(address: string, server?: string): Promise<Array<IServiceResponse<IAssetInfo>>> {
    return getDataTxFields(address, server)
        .then(toHash('key'))
        .then(getAssetListFromHash);
}

export interface IOracleInfo {
    name: string;
    site: string;
    mail: string;
    description: IHash<string>;
    logo?: string;
}

export interface IAssetInfo {
    status: number; // TODO! Add enum
    logo: string;
    site: string;
    ticker: string;
    email: string;
    description: IHash<string>;
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
