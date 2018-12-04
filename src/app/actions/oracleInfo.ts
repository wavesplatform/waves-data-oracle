import { createAction } from 'redux-actions';

export namespace OracleInfoActions {
  export enum Type {
    GET_INFO = 'GET_INFO',
    SAVE_INFO = 'SAVE_INFO',
    SET_STATUS = 'SET_STATUS',
    SET_SAVE_STATUS = 'SET_SAVE_STATUS',
    SET_INFO = 'SET_INFO',
  }
  
  export const getOracleInfo = createAction(Type.GET_INFO);
  export const saveOracleInfo = createAction(Type.SAVE_INFO);
  export const setOracleInfoStatus = createAction(Type.SET_STATUS);
  export const setOracleSaveStatus = createAction(Type.SET_SAVE_STATUS);
  export const setOracleInfo = createAction(Type.SET_INFO);

}

export type OracleInfoActions = Omit<typeof OracleInfoActions, 'Type'>;
