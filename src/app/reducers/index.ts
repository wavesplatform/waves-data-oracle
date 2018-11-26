import { combineReducers } from 'redux';
import { RootState } from './state';
import { UserReducer } from './user';
import { AssetsReducer } from './assets';

export { RootState };

export const rootReducer = combineReducers<RootState>({
  user: UserReducer as any,
  assets: AssetsReducer as any,
});
