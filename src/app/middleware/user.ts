import { Middleware } from 'redux';
import { UserActions } from '../actions';
import { UserService, IPublicState } from '../services/KeeperService';

export const login: Middleware = (store) => (next) => (action) => {
  if (action.type === UserActions.Type.LOGIN_USER) {
    UserService.getState().then(( publicState ) => {
      if (!publicState) {
        next(UserActions.setUserError({ error: 'Keeper not available!' }));
      }
      
      next(UserActions.setUser((<IPublicState>publicState).account));
    }).catch((e) => { error: e.message });
    return;
  }
  
  return next(action);
};
