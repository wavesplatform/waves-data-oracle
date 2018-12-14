import * as OracleData from '@waves/oracle-data';

export enum TOKENS_STATUS {
    LOADING = 'LOADING',
    READY = 'READY',
    HAS_ERROR = 'HAS_ERROR',
}

export enum TOKEN_SAVE_STATUS {
    LOADING = 'LOADING',
    READY = 'READY',
    SERVER_ERROR = 'SERVER_ERROR'
}

export interface TokenModel {
    content: Partial<OracleData.TProviderAsset>& { name?: string };
    errors: Array<OracleData.IResponseError>|null;
}

export interface TokensModel {
    content: Array<TokenModel>;
    status: TOKENS_STATUS;
    saveStatus: TOKEN_SAVE_STATUS|null;
}
