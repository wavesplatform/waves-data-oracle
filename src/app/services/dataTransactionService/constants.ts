export const enum STATUSES {
    OK = 'ok',
    EMPTY = 'empty',
    ERROR = 'error'
}

export const enum DATA_TRANSACTION_FIELD_TYPE {
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    STRING = 'string',
    BINARY = 'binary'
}

export const PATTERNS = {
    ASSET_ID: '<ASSET_ID>',
    LANG: '<LANG>'
};

export const enum ORACLE_RESERVED_FIELDS {
    NAME = 'oracle_name',
    SITE = 'oracle_site',
    LOGO = 'oracle_logo',
    LOGO_META = 'oracle_logo_meta',
    MAIL = 'oracle_mail',
    DESCRIPTION = 'oracle_description',
    LANG_LIST = 'oracle_lang_list'
}

export const enum ORACLE_ASSET_FIELD_PATTERN {
    STATUS = 'status_id_<ASSET_ID>',
    LOGO = 'logo_<ASSET_ID>',
    LOGO_META = 'logo_meta_<ASSET_ID>',
    DESCRIPTION = 'description_<LANG>_<ASSET_ID>',
    SITE = 'site_<ASSET_ID>',
    TICKER = 'ticker_<ASSET_ID>',
    EMAIL = 'email_<ASSET_ID>'
}

export const FEE_SEED = 'seed for calculate fee';

export const DEFAULT_LANG = 'en';

export interface IDataTransactionField {
    type: DATA_TRANSACTION_FIELD_TYPE;
    key: string;
    value: string | boolean | number;
}
