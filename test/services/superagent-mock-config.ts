// ./superagent-mock-config.js file
import {
    ORACLE_ASSET_FIELD_PATTERN,
    ORACLE_RESERVED_FIELDS
} from '../../src/app/services/dataTransactionService/utils';
import { DATA_TRANSACTION_FIELD_TYPE, IAssetInfo } from '../../src/app/services/dataTransactionService';

const oracleRequiredFields = [
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
        key: `${ORACLE_RESERVED_FIELDS.DESCRIPTION}_en`,
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: 'Some oracle en description'
    }
];

const PATTERNS = {
    ASSET_ID: '<ASSET_ID>',
    LANG: '<LANG>'
};

function replaceAssetID(key: string, id: string): string {
    return key.replace(PATTERNS.ASSET_ID, `<${id}>`);
}

function replaceDescriptionLang(key: string, lang: string): string {
    return key.replace(PATTERNS.LANG, `<${lang}>`);
}

const generateAsset = (asset: IAssetInfo) => [
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
    ...Object.keys(asset.description).map(lang => ({
        key: replaceDescriptionLang(replaceAssetID(ORACLE_ASSET_FIELD_PATTERN.DESCRIPTION, asset.id), lang),
        type: DATA_TRANSACTION_FIELD_TYPE.STRING,
        value: asset.description[lang]
    }))
];

export default [
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/no-oracle',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => []
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/oracle-info-no-lang',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => oracleRequiredFields
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/oracle-info-empty-lang',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => [
            ...oracleRequiredFields,
            {
                key: ORACLE_RESERVED_FIELDS.LANG_LIST,
                type: DATA_TRANSACTION_FIELD_TYPE.STRING,
                value: ''
            }
        ]
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/oracle-info-description-en',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => [
            ...oracleRequiredFields,
            {
                key: ORACLE_RESERVED_FIELDS.LANG_LIST,
                type: DATA_TRANSACTION_FIELD_TYPE.STRING,
                value: 'en'
            }
        ]
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/oracle-info-binary-name',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => [
            ...oracleRequiredFields.filter(item => item.key !== ORACLE_RESERVED_FIELDS.NAME),
            {
                key: ORACLE_RESERVED_FIELDS.NAME,
                type: DATA_TRANSACTION_FIELD_TYPE.BINARY,
                value: 'some-data'
            }
        ]
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/with-one-asset',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => [
            ...oracleRequiredFields,
            ...generateAsset({
                id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
                email: 'test-asset@oracle.com',
                logo: 'asset-logo',
                site: 'https://test-asset.com',
                status: 1,
                ticker: 'TEST',
                description: {
                    en: 'Test asset en description'
                }
            })
        ]
    },
    {
        /**
         * regular expression of URL
         */
        pattern: 'https://nodes.wavesplatform.com/addresses/data/with-two-asset',

        fixtures: () => null,

        /**
         * returns the result of the GET request
         *
         * @param match array Result of the resolution of the regular expression
         * @param data  mixed Data returns by `fixtures` attribute
         */
        get: () => [
            ...oracleRequiredFields,
            ...generateAsset({
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
            ...generateAsset({
                id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJe',
                email: 'test-asset@oracle.com',
                logo: 'asset-logo',
                site: 'https://test-asset.com',
                status: 2,
                ticker: 'TEST',
                description: {
                    en: 'Test asset en description'
                }
            })
        ]
    }
];
