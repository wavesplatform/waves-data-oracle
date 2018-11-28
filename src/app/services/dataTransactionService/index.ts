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


export function getOracleInfo(address: string): Promise<IServiceResponse<IOracleInfo>> {
    return getDataTxFields(address)
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

export function getAssets(address: string): Promise<Array<IServiceResponse<IAssetInfo>>> {
    return getDataTxFields(address)
        .then(toHash('key'))
        .then(getAssetListFromHash);
}

export interface IOracleInfo {
    name: string | null;
    site: string | null;
    mail: string | null;
    description: IHash<string> | null;
    logo: string | null;
}

export interface IAssetInfo {
    id: string;
    status: number; // TODO! Add enum
    logo: string | null;
    site: string | null;
    ticker: string | null;
    email: string | null;
    description: IHash<string> | null;
}

export interface IServiceResponse<T> {
    status: STATUSES;
    data: T,
    errors: {
        [key in keyof T]: Error
    };
}
