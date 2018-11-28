import {
    createResponseHash,
    getAssetListFromHash,
    getDataTxFields,
    getDescriptionField,
    getField,
    getLangList,
    getOracleDescriptionKey,
    replaceAssetID,
    toHash
} from './utils';
import {
    DATA_TRANSACTION_FIELD_TYPE,
    DEFAULT_LANG,
    FEE_SEED,
    ORACLE_ASSET_FIELD_PATTERN, ORACLE_RESERVED_FIELDS,
    STATUSES,
    TField
} from './constants';
import { IHash } from '../../../interfaces';
import { data } from 'waves-transactions';

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

export function setOracleInfo({ info }: ISetOracleInfoParams) {

}

export function getOracleInfoDataFields(info: IOracleInfo): Array<TField> {
    return [
        { key: ORACLE_RESERVED_FIELDS.NAME, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.name },
        { key: ORACLE_RESERVED_FIELDS.MAIL, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.mail },
        { key: ORACLE_RESERVED_FIELDS.LOGO, type: DATA_TRANSACTION_FIELD_TYPE.BINARY, value: info.logo },
        { key: ORACLE_RESERVED_FIELDS.SITE, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.site },
        {
            key: ORACLE_RESERVED_FIELDS.LANG_LIST,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: Object.keys(info.description || { [DEFAULT_LANG]: true }).join(',')
        },
        ...Object.keys(info.description || {}).map(lang => ({
            key: getOracleDescriptionKey(lang), type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.description[lang]
        })) as Array<TField>
    ];
}

export function getAssetFields(asset: IAssetInfo): Array<TField> {
    return [
        {
            key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.STATUS, asset.id),
            type: DATA_TRANSACTION_FIELD_TYPE.INTEGER,
            value: asset.status
        },
        {
            key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.TICKER, asset.id),
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: asset.ticker
        },
        {
            key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.LOGO, asset.id),
            type: DATA_TRANSACTION_FIELD_TYPE.BINARY,
            value: asset.logo
        },
        {
            key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.EMAIL, asset.id),
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: asset.email
        },
        {
            key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.SITE, asset.id),
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: asset.site
        },
        ...Object.keys(asset.description || {}).map(lang => ({
            key: getDescriptionField(asset.id, lang),
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: asset.description[lang]
        })) as Array<TField>
    ];
}

export function currentFee(fields: Array<TField>): string {
    const tx = data({ data: fields }, FEE_SEED);
    return String(tx.fee);
}

export interface ISetOracleInfoParams {
    info: IOracleInfo;
    address: string;
    publicKey: string;
    networkByte: number;
    nodeUrl?: string;
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
