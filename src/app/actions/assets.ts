import { createAction } from 'redux-actions';

export namespace AssetsActions {
  export enum Type {
    SET_ASSETS = 'SET_ASSETS',
    GET_ASSETS = 'GET_ASSETS',
    ADD_ASSET = 'ADD_ASSET',
    EDIT_ASSET = 'EDIT_ASSET',
    SET_ASSET = 'SET_ASSET',
    REMOVE_ASSET = 'REMOVE_ASSET',
  }
  
  export const getAssets = createAction(Type.GET_ASSETS);
  export const setAssets = createAction(Type.SET_ASSETS);
  export const addAsset = createAction(Type.ADD_ASSET);
  export const editAsset = createAction(Type.EDIT_ASSET);
  export const setAsset = createAction(Type.SET_ASSET);
  export const removeAsset = createAction(Type.REMOVE_ASSET);
}

export type AssetsActions = Omit<typeof AssetsActions, 'Type'>;
