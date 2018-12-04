import { UserModel, TokensModel, AppModel, OracleInfoModel } from 'app/models';

export interface RootState {
  user: RootState.UserState;
  app: RootState.AppState;
  oracleInfo: RootState.OracleInfoState;
  tokens: RootState.TokensState;
  router?: any;
}

export namespace RootState {
  export type UserState = UserModel;
  export type AppState = AppModel;
  export type TokensState = TokensModel;
  export type OracleInfoState = OracleInfoModel;
}
