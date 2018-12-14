import * as OracleData from '@waves/oracle-data';

export enum ORACLE_STATUS {
    LOADING = 'LOADING',
    EMPTY = 'EMPTY',
    READY = 'READY',
    HAS_ERROR = 'HAS_ERROR',
    SERVER_ERROR = 'SERVER_ERROR'
}

export enum ORACLE_SAVE_STATUS {
    LOADING = 'LOADING',
    READY = 'READY',
    SERVER_ERROR = 'SERVER_ERROR'
}


export interface OracleInfoModel {
    content: Partial<OracleData.IProviderData>;
    status: ORACLE_STATUS;
    saveStatus?: ORACLE_SAVE_STATUS|null,
    errors: Array<OracleData.IResponseError>|null;
}


