import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { UserActions } from 'app/actions/user';
import { UserModel } from 'app/models';

const initialState: RootState.UserState = { address: '', network: '', publicKey: '', error: '' };

export const UserReducer = handleActions<RootState.UserState, UserModel>(
  {
    [UserActions.Type.SET_USER]: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    [UserActions.Type.SET_USER_ERROR]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [UserActions.Type.LOGOUT_USER]: () => {
      return { ...initialState };
    },
    [UserActions.Type.LOGIN_USER]: () => {
      return { ...initialState };
    },
  },
  
  initialState
);
