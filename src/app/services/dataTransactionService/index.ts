import {
    createDataTxField,
    createResponseHash,
    getAssetListFromHash,
    getDataTxFields,
    getDescriptionField,
    getField,
    getLangList,
    getOracleDescriptionKey,
    replaceAssetID, splitLogo,
    toHash
} from './utils';
import {
    DATA_TRANSACTION_FIELD_TYPE,
    FEE_SEED, IDataTransactionField,
    ORACLE_ASSET_FIELD_PATTERN,
    ORACLE_RESERVED_FIELDS,
    STATUSES
} from './constants';
import { userService } from '../KeeperService';
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
            api.readBinary(ORACLE_RESERVED_FIELDS.LOGO, logo => {
                const withoutPrefix = logo && logo.replace('base64:', '') || '';
                api.readString(ORACLE_RESERVED_FIELDS.LOGO_META, meta => {
                    if (logo && meta) {
                        api.put('logo', `${meta}${withoutPrefix}`);
                    } else {
                        api.put('logo', null);
                    }
                });
            });
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

export function setOracleInfo(info: IOracleInfo, timestamp?: number) {
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
        }
    });
}

export function setAssetInfo(asset: Partial<IAssetInfo> & { id: string }, timestamp?: number) {
    const fields = getAssetFields(asset);
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
        }
    });
}

export function getOracleInfoDataFields(info: Partial<IOracleInfo>): Array<IDataTransactionField> {

    const fieldsFilter = <T extends { value: unknown }>(field: T) => field.value != null;

    const fields = [
        { key: ORACLE_RESERVED_FIELDS.NAME, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.name },
        { key: ORACLE_RESERVED_FIELDS.MAIL, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.mail },
        { key: ORACLE_RESERVED_FIELDS.SITE, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: info.site }
    ].filter(fieldsFilter);

    const logoData = splitLogo(info.logo);

    const logoFields = [
        { key: ORACLE_RESERVED_FIELDS.LOGO, type: DATA_TRANSACTION_FIELD_TYPE.BINARY, value: logoData.logo },
        { key: ORACLE_RESERVED_FIELDS.LOGO_META, type: DATA_TRANSACTION_FIELD_TYPE.STRING, value: logoData.meta }
    ].filter(fieldsFilter);

    if (logoFields.length) {
        fields.push(...logoFields);
    }

    const langList = Object.keys(info.description || {});

    if (langList.length) {
        const description = info.description as Record<string, string>;

        fields.push({
            key: ORACLE_RESERVED_FIELDS.LANG_LIST,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: langList.join(',')
        });

        fields.push(...langList.map(lang => {
            return createDataTxField(getOracleDescriptionKey(lang), DATA_TRANSACTION_FIELD_TYPE.STRING, description[lang]) as any;
        }).filter(fieldsFilter));
    }

    return fields as Array<IDataTransactionField>;
}

export function getAssetFields(asset: Partial<IAssetInfo> & { id: string }): Array<IDataTransactionField> {
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
    ].filter(field => field.value != null) as Array<IDataTransactionField>;

    const langList = Object.keys(asset.description || {});

    if (langList.length) {
        const description = asset.description as IHash<string>;
        langList.forEach(lang => {
            fields.push(createDataTxField(getDescriptionField(asset.id, lang), DATA_TRANSACTION_FIELD_TYPE.STRING, description[lang]));
        });
    }

    return fields;
}

export function currentFee(fields: Array<IDataTransactionField>): string {
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
    description: Record<string, string> | null;
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
