import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { AppActions } from 'app/actions';
import { AppModel } from 'app/models';

const initialState: RootState.AppState = {
  appError: null,
  filters: [],
  isAuthenticated: false,
  kepperError: null,
  loading: false
};

export const AppReducer = handleActions<RootState.AppState, Partial<AppModel>>(
  {
    [AppActions.Type.FILTER]: (state, action) => {
      return <AppModel>{ ...state, filters: action.payload };
    },
    [AppActions.Type.AUTHENTICATED]: (state, action) => {
      return <AppModel>{ ...state, isAuthenticated: action.payload };
    },
    [AppActions.Type.KEEPER_ERROR]: (state, action) => {
      return <AppModel>{ ...state, kepperError: action.payload };
    },
    [AppActions.Type.APP_ERROR]: (state, action) => {
      return <AppModel>{ ...state, appError: action.payload };
    },
    [AppActions.Type.LOADING]: (state, action) => {
      return <AppModel>{ ...state, loading: action.payload };
    },
  },
  
  initialState
);
