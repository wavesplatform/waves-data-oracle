import { AnyAction, Middleware, MiddlewareAPI } from 'redux';
import { OracleInfoActions, AppActions, OracleTokensActions } from '../actions';
import * as OracleData from '@waves/oracle-data';
import {
    ORACLE_SAVE_STATUS,
    ORACLE_STATUS,
    OracleInfoModel,
    TokensModel,
    TOKENS_STATUS,
    TOKEN_SAVE_STATUS
} from 'app/models';
import {
    setOracleInfo as apiSetOracleInfo,
    getOracleData as apiGetInfo,
    setAssetInfo as apiToken,
} from '../services/dataTransactionService';
import { middlewareFabric as mwF } from './utils';

export const getOracleData: Middleware =
    mwF<MiddlewareAPI, AnyAction>(AppActions.Type.GET_ALL_DATA)((store) => {
        const state = store.getState();
        const { user } = state;
        store.dispatch(AppActions.setLoading(true));
        
        apiGetInfo(user.address, user.server).then(({ oracle, assets }) => {
            const infoData = parseOracleInfoResponse(oracle);
            const tokens = parseTokensResponse(assets);
            
            store.dispatch(AppActions.setServerError(null));
            store.dispatch(OracleInfoActions.setOracleInfo(infoData));
            store.dispatch(OracleTokensActions.setOracleTokens(tokens));

        }).catch((e) => {
            store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.SERVER_ERROR));
            store.dispatch(AppActions.setServerError(e));
        }).then(() => {
            store.dispatch(AppActions.setLoading(false));
        });
    });



export const setOracleInfo: Middleware =
    mwF<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.SAVE_INFO)((store, next, action) => {
        store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.LOADING));
        apiSetOracleInfo(action.payload).then(
            () => {
                store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.READY));
                store.dispatch(OracleInfoActions.setOracleInfoDiff(action.payload));
            }
        ).catch(() => {
            store.dispatch(OracleInfoActions.setOracleSaveStatus(ORACLE_SAVE_STATUS.SERVER_ERROR));
        });
    });

export const setOracleToken: Middleware =
    mwF<MiddlewareAPI, AnyAction>(OracleTokensActions.Type.SAVE_TOKEN)((store, next, action) => {
        store.dispatch(OracleTokensActions.setSaveTokenStatus(TOKEN_SAVE_STATUS.LOADING));
        apiToken(action.payload).then(
            () => {
                store.dispatch(OracleTokensActions.setSaveTokenStatus(TOKEN_SAVE_STATUS.READY));
                store.dispatch(OracleTokensActions.setTokenDiff(action.payload));
            }
        ).catch(() => {
            store.dispatch(OracleTokensActions.setSaveTokenStatus(TOKEN_SAVE_STATUS.SERVER_ERROR));
        });
    });


const parseOracleInfoResponse = (response: OracleData.TResponse<OracleData.IProviderData>): OracleInfoModel => {

    if (response.status === OracleData.RESPONSE_STATUSES.OK) {
        const { content } = response;
        return {
            errors: null,
            status: ORACLE_STATUS.READY,
            content
        };
    } else {
        const { content, errors } = response;
        const isEmpty = Object.keys(content).length === 0;
        return {
            status: isEmpty ?  ORACLE_STATUS.EMPTY : ORACLE_STATUS.HAS_ERROR,
            errors: isEmpty ? null : errors,
            content,
        }
    }
};

const parseTokensResponse = (responses: Array<OracleData.TResponse<OracleData.TProviderAsset>>): TokensModel => {

    const getAsset = (response: OracleData.TResponse<OracleData.TProviderAsset>) => {
        if (response.status === OracleData.RESPONSE_STATUSES.OK) {
            return {
                status: TOKENS_STATUS.READY,
                content: response.content,
                errors: null,
            }
        } else {
            return {
                status: TOKENS_STATUS.HAS_ERROR,
                content: response.content,
                errors: response.errors,
            };
        }
    };
    
    const result = responses.map(getAsset);

    return {
        status: TOKENS_STATUS.READY,
        saveStatus: null,
        content: result
    };
};
