import { Middleware, MiddlewareAPI, AnyAction } from 'redux';
import { UserActions, AppActions } from '../actions';
import { userService, IPublicState } from '../services/KeeperService';
import { middlewareFabric } from './utils';

export const login: Middleware = middlewareFabric<MiddlewareAPI, AnyAction>(UserActions.Type.LOGIN_USER)((store) => {
    store.dispatch(AppActions.setKeeperError(null));
    userService.getState()
        .then((publicState: IPublicState) => {
            const { account, initialized, locked, network } = publicState;
            
            switch (true) {
                case !initialized:
                    throw { code: 1, message: 'Init keeper and add account' };
                case locked:
                    throw { code: 2, message: 'Unlock keeper' };
                case !account:
                    throw { code: 3, message: 'Add account to keeper' };
            }
            
            store.dispatch(UserActions.setUser({ ...network, ...account }));
            store.dispatch(AppActions.setAuthenticated(true));
        })
        .catch((error) => {
            store.dispatch(AppActions.setAuthenticated(false));
            store.dispatch(AppActions.setKeeperError(error));
        });
});

export const logout: Middleware = (store) => (next) => (action) => {
    if (action.type === UserActions.Type.LOGOUT_USER) {
        store.dispatch(AppActions.clearStore());
    }
    return next(action);
};
