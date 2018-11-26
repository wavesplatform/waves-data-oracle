import { Middleware } from 'redux';
import { UserActions } from '../actions';

export const login: Middleware = (store) => (next) => (action) => {
  if (action.type === UserActions.Type.LOGIN_USER) {
    
    return;
  }
  
  return next(action);
};
