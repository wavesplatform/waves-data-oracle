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
    NAME = 'data_provider_name',
    SITE = 'data_provider_link',
    LOGO = 'data_provider_logo',
    LOGO_META = 'data_provider_logo_meta',
    EMAIL = 'data_provider_email',
    DESCRIPTION = 'data_provider_description',
    LANG_LIST = 'data_provider_lang_list'
}

export const enum ORACLE_ASSET_FIELD_PATTERN {
    STATUS = 'status_id_<ASSET_ID>',
    LOGO = 'logo_<ASSET_ID>',
    LOGO_META = 'logo_meta_<ASSET_ID>',
    DESCRIPTION = 'description_<LANG>_<ASSET_ID>',
    LINK = 'link_<ASSET_ID>',
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
