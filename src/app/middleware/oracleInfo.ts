import { AnyAction, Middleware, MiddlewareAPI } from 'redux';
import { OracleInfoActions, AppActions, OracleTokensActions } from '../actions';
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
    IOracleInfo,
    IServiceResponse,
    STATUSES, IAssetInfo
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


export const getOracleInfo: Middleware =
    mwF<MiddlewareAPI, AnyAction>(OracleInfoActions.Type.GET_INFO)((store) => {
        const state = store.getState();
        const { user } = state;

        store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.LOADING));
        apiGetInfo(user.address, user.server)
            .then(oracleInfo => {
                const infoData = parseOracleInfoResponse(oracleInfo.oracle);
                store.dispatch(OracleInfoActions.setOracleInfo(infoData));
            }).catch((e) => {
            store.dispatch(OracleInfoActions.setOracleInfoStatus(ORACLE_STATUS.SERVER_ERROR));
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


const parseOracleInfoResponse = (response: IServiceResponse<IOracleInfo>): OracleInfoModel => {
    const { status, data, errors: oracleErrors = null } = response;

    switch (status) {
        case STATUSES.EMPTY:
            return { status: ORACLE_STATUS.EMPTY, content: data, oracleErrors };
        case STATUSES.ERROR:
            return { status: ORACLE_STATUS.HAS_ERROR, content: data, oracleErrors };
        case STATUSES.OK:
            return { status: ORACLE_STATUS.READY, content: data, oracleErrors };
    }
};

const parseTokensResponse = (responses: Array<IServiceResponse<IAssetInfo>>): TokensModel => {

    const result = responses.map((response) => {
        const { status, data, errors: tokenErrors } = response;
        switch (status) {
            case STATUSES.EMPTY:
                return { status: TOKENS_STATUS.EMPTY, content: data, tokenErrors };
            case STATUSES.ERROR:
                return { status: TOKENS_STATUS.HAS_ERROR, content: data, tokenErrors };
            case STATUSES.OK:
                return { status: TOKENS_STATUS.READY, content: data, tokenErrors };
        }
    });

    return {
        status: TOKENS_STATUS.READY,
        saveStatus: null,
        content: result
    };
};
