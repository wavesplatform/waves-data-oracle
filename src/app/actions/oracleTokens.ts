import { createAction } from 'redux-actions';

export namespace OracleTokensActions {
  export enum Type {
    GET_TOKENS = 'GET_TOKENS',
    SAVE_TOKEN = 'SAVE_TOKEN',
    SET_STATUS = 'SET_STATUS',
    SET_SAVE_STATUS = 'SET_SAVE_STATUS',
    SET_TOKENS = 'SET_TOKENS',
    SET_TOKEN_DIFF = 'SET_TOKEN_DIFF',
    GET_TOKEN_NAME = 'GET_TOKEN_NAME',
    SET_TOKEN_NAME = 'SET_TOKEN_NAME',
  }
  
  export const getTokens = createAction(Type.GET_TOKENS);
  export const saveToken = createAction(Type.SAVE_TOKEN);
  export const setTokenStatus = createAction(Type.SET_STATUS);
  export const setSaveTokenStatus = createAction(Type.SET_SAVE_STATUS);
  export const setOracleTokens = createAction(Type.SET_TOKENS);
  export const setTokenDiff = createAction(Type.SET_TOKEN_DIFF);
  export const getTokenName = createAction(Type.GET_TOKEN_NAME);
  export const setTokenName = createAction(Type.SET_TOKEN_NAME);
}

export type OracleTokensActions = Omit<typeof OracleTokensActions, 'Type'>;
