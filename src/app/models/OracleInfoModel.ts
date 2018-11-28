import { IOracleInfo } from '../services/dataTransactionService';

export enum ORACLE_STATUS {
    LOADING = 'LOADING',
    EMPTY = 'EMPTY',
    READY = 'READY',
    HAS_ERROR = 'HAS_ERROR',
}

export interface OracleInfoModel extends  IOracleInfo {
    status: ORACLE_STATUS;
    oracleErrors: { [P in keyof IOracleInfo]?: Error }|null;
}


