// ./superagent-mock-config.js file
import { ORACLE_RESERVED_FIELDS } from '../../src/app/services/dataTransactionService/utils';
import { DATA_TRANSACTION_FIELD_TYPE } from '../../src/app/services/dataTransactionService';

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
    }
];