import { createAction } from 'redux-actions';

export namespace AppActions {
  export enum Type {
    LOADING = 'LOADING',
    APP_ERROR = 'ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    KEEPER_ERROR = 'KEEPER_ERROR',
    AUTHENTICATED = 'AUTHENTICATED',
    FILTER = 'FILTER',
    ADD_ASSET = 'ADD_ASSET',
    EDIT_ASSET = 'EDIT_ASSET',
    REMOVE_ASSET = 'REMOVE_ASSET',
    GET_ALL_DATA = 'GET_ALL_DATA'
  }
  
  export const getOracleData = createAction(Type.GET_ALL_DATA);
  export const setLoading = createAction(Type.LOADING);
  export const setAppError = createAction(Type.APP_ERROR);
  export const setServerError = createAction(Type.SERVER_ERROR);
  export const setKeeperError = createAction(Type.KEEPER_ERROR);
  export const setAuthenticated = createAction(Type.AUTHENTICATED);
  export const setFilter = createAction(Type.FILTER);
  export const addAsset = createAction(Type.ADD_ASSET);
  export const editAsset = createAction(Type.EDIT_ASSET);
  export const removeAsset = createAction(Type.REMOVE_ASSET);
}

export type AppActions = Omit<typeof AppActions, 'Type'>;
