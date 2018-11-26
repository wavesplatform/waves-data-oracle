import { createAction } from 'redux-actions';

export namespace UserActions {
  export enum Type {
    LOGIN_USER = 'LOGIN',
    SET_USER = 'SET_USER',
    SET_USER_ERROR = 'SET_USER_ERROR',
    LOGOUT_USER = 'LOGOUT_USER',
  }
  
  export const login = createAction(Type.LOGIN_USER);
  export const logout = createAction(Type.LOGOUT_USER);
  export const setUser = createAction(Type.SET_USER);
  export const setUserError = createAction(Type.SET_USER_ERROR);
}

export type UserActions = Omit<typeof UserActions, 'Type'>;
