import { createAction } from 'redux-actions';

export namespace OracleTokensActions {
  export enum Type {
    GET_INFO = 'GET_INFO',
    SAVE_INFO = 'SAVE_INFO',
    SET_STATUS = 'SET_STATUS',
    SET_SAVE_STATUS = 'SET_SAVE_STATUS',
    SET_INFO = 'SET_INFO',
  }
  
  export const getTokens = createAction(Type.GET_INFO);
  export const saveToken = createAction(Type.SAVE_INFO);
  export const setTokenStatus = createAction(Type.SET_STATUS);
  export const setSaveTokenStatus = createAction(Type.SET_SAVE_STATUS);
  export const setOracleTokens = createAction(Type.SET_INFO);

}

export type OracleTokensActions = Omit<typeof OracleTokensActions, 'Type'>;
