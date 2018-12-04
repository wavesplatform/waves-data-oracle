import { IAssetInfo, IOracleInfo } from '../services/dataTransactionService';

export enum TOKENS_STATUS {
    LOADING = 'LOADING',
    EMPTY = 'EMPTY',
    READY = 'READY',
    HAS_ERROR = 'HAS_ERROR',
    SERVER_ERROR = 'SERVER_ERROR'
}

export enum TOKEN_SAVE_STATUS {
    LOADING = 'LOADING',
    READY = 'READY',
    SERVER_ERROR = 'SERVER_ERROR'
}

export interface TokenModel {
    content: IAssetInfo;
    tokenErrors: { [P in keyof IOracleInfo]?: Error }|null;
}

export interface TokensModel {
    content: Array<TokenModel>;
    status: TOKENS_STATUS;
    saveStatus: TOKEN_SAVE_STATUS|null;
}
