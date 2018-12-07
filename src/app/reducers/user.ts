import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { UserActions, AppActions } from 'app/actions';
import { UserModel } from 'app/models';

const initialState: RootState.UserState = {
    address: '',
    name: '',
    network: '',
    publicKey: '',
    error: '',
    matcher: '',
    server: '',
    balance: null
};

export const UserReducer = handleActions<RootState.UserState, UserModel>(
    {
        [UserActions.Type.SET_USER]: (state, action) => {
            if (action.payload) {
                return { ...state, ...action.payload };
            }
            return state;
        },
        [UserActions.Type.LOGOUT_USER]: () => {
            return { ...initialState };
        },
        [UserActions.Type.LOGIN_USER]: () => {
            return { ...initialState };
        },
        [AppActions.Type.CLEAR_STORE]: () => {
            return { ...initialState };
        }
    },
    
    initialState
);
