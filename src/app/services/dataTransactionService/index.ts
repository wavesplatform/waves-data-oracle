import {
    createDataTxField,
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
    FEE_SEED,
    ORACLE_ASSET_FIELD_PATTERN,
    ORACLE_RESERVED_FIELDS,
    STATUSES,
    TField
} from './constants';
import { userService } from '../KeeperService';
import { IHash } from '../../../interfaces';
import { data } from 'waves-transactions';

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

export function setOracleInfo({ info, timestamp }: ISetOracleInfoParams) {
    const fields = getOracleInfoDataFields(info);
    const fee = currentFee(fields);
    return userService.signAndPublishData({
        type: 12,
        data: {
            timestamp: timestamp || Date.now(),
            data: fields,
            fee: {
                coins: fee,
                assetId: 'WAVES'
            }
        } as any
    });
}

export function getOracleInfoDataFields(info: Partial<IOracleInfo>): Array<TField> {

    const fields = [
        { key: ORACLE_RESERVED_FIELDS.NAME, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.name },
        { key: ORACLE_RESERVED_FIELDS.MAIL, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.mail },
        { key: ORACLE_RESERVED_FIELDS.LOGO, type: DATA_TRANSACTION_FIELD_TYPE.BINARY, value: info.logo },
        { key: ORACLE_RESERVED_FIELDS.SITE, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.site }
    ].filter(field => field.value !== null) as Array<TField>;

    const langList = Object.keys(info.description || {});

    if (langList.length) {
        const description = info.description as IHash<string>;
        fields.push(createDataTxField(ORACLE_RESERVED_FIELDS.LANG_LIST, DATA_TRANSACTION_FIELD_TYPE.STRING, langList.join(',')));
        fields.push(...langList.map(lang => {
            return createDataTxField(getOracleDescriptionKey(lang), DATA_TRANSACTION_FIELD_TYPE.STRING, description[lang]);
        }));
    }

    return fields;
}

export function getAssetFields(asset: IAssetInfo): Array<TField> {
    const fields = [
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
        }
    ].filter(field => field.value !== null) as Array<TField>;

    const langList = Object.keys(asset.description || {});

    if (langList.length) {
        const description = asset.description as IHash<string>;
        langList.forEach(lang => {
            fields.push(createDataTxField(getDescriptionField(asset.id, lang), DATA_TRANSACTION_FIELD_TYPE.STRING, description[lang]));
        });
    }

    return fields;
}

export function currentFee(fields: Array<TField>): string {
    const tx = data({ data: fields }, FEE_SEED);
    return String(tx.fee);
}

export interface ISetOracleInfoParams {
    info: Partial<IOracleInfo>;
    address?: string; // TODO!
    publicKey?: string; // TODO!
    networkByte?: number; // TODO!
    nodeUrl?: string;
    timestamp?: number;
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
