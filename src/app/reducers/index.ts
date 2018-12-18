import { combineReducers } from 'redux';
import { RootState } from './state';
import { UserReducer } from './user';
import { AppReducer } from './app';
import { OracleInfosReducer } from './oracleInfo';
import { TokensReducer } from './oracleTokens';
import { NodeTokensReducer } from './nodeTokens';

export { RootState };

export const rootReducer = combineReducers<RootState>({
  user: UserReducer as any,
  app: AppReducer as any,
  oracleInfo: OracleInfosReducer as any,
  tokens: TokensReducer as any,
  nodeTokens: NodeTokensReducer as any,
});
