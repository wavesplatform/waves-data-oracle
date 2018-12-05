import { createAction } from 'redux-actions';

export namespace OracleTokensActions {
  export enum Type {
    GET_TOKENS = 'GET_TOKENS',
    SAVE_TOKEN = 'SAVE_TOKEN',
    SET_STATUS = 'SET_STATUS',
    SET_SAVE_STATUS = 'SET_SAVE_STATUS',
    SET_TOKENS = 'SET_TOKENS',
  }
  
  export const getTokens = createAction(Type.GET_TOKENS);
  export const saveToken = createAction(Type.SAVE_TOKEN);
  export const setTokenStatus = createAction(Type.SET_STATUS);
  export const setSaveTokenStatus = createAction(Type.SET_SAVE_STATUS);
  export const setOracleTokens = createAction(Type.SET_TOKENS);

}

export type OracleTokensActions = Omit<typeof OracleTokensActions, 'Type'>;
