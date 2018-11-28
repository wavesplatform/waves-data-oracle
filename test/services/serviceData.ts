import {
    DATA_TRANSACTION_FIELD_TYPE,
    IAssetInfo,
    ORACLE_ASSET_FIELD_PATTERN,
    ORACLE_RESERVED_FIELDS,
    PATTERNS
} from '../../src/app/services/dataTransactionService';
import { replaceAssetID } from '../../src/app/services/dataTransactionService/utils';
import { IHash } from '../../src/interfaces';


function replaceDescriptionLang(key: string, lang: string): string {
    return key.replace(PATTERNS.LANG, `<${lang}>`);
}

export const generateAsset = (asset: IAssetInfo) => [
    {
        key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.STATUS, asset.id),
        type: DATA_TRANSACTION_FIELD_TYPE.INTEGER,
        value: asset.status
    },
    {
        key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.SITE, asset.id),
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: asset.site
    },
    {
        key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.EMAIL, asset.id),
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: asset.email
    },
    {
        key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.LOGO, asset.id),
        type: DATA_TRANSACTION_FIELD_TYPE.BINARY,
        value: asset.logo
    },
    {
        key: replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.TICKER, asset.id),
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: asset.ticker
    },
    ...Object.keys(asset.description || {}).map(lang => ({
        key: replaceDescriptionLang(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.DESCRIPTION, asset.id), lang),
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: (asset.description as IHash<string>)[lang]
    }))
];

export const ORACLE = {
    FIELDS: [
        {
            key: ORACLE_RESERVED_FIELDS.NAME,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: 'Test Oracle Name'
        },
        {
            key: ORACLE_RESERVED_FIELDS.MAIL,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: 'test@oracle.com'
        },
        {
            key: ORACLE_RESERVED_FIELDS.SITE,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: 'https://test.oracle.com'
        },
        {
            key: ORACLE_RESERVED_FIELDS.LOGO,
            type: DATA_TRANSACTION_FIELD_TYPE.BINARY,
            value: 'logo'
        },
        {
            key: ORACLE_RESERVED_FIELDS.LANG_LIST,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: 'en'
        },
        {
            key: `${ORACLE_RESERVED_FIELDS.DESCRIPTION}_en`,
            type: DATA_TRANSACTION_FIELD_TYPE.STRING,
            value: 'Some oracle en description'
        }
    ],
    DATA: {
        name: 'Test Oracle Name',
        site: 'https://test.oracle.com',
        mail: 'test@oracle.com',
        logo: 'logo',
        description: {
            en: 'Some oracle en description'
        }
    }
};

export const ASSET = {
    FIELDS: generateAsset({
        id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        email: 'test-asset@oracle.com',
        logo: 'asset-logo',
        site: 'https://test-asset.com',
        status: 1,
        ticker: 'TEST',
        description: {
            en: 'Test asset en description'
        }
    }),
    DATA: {
        id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        email: 'test-asset@oracle.com',
        logo: 'asset-logo',
        site: 'https://test-asset.com',
        status: 1,
        ticker: 'TEST',
        description: {
            en: 'Test asset en description'
        }
    }
};
