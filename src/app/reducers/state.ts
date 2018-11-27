import { UserModel, AssetModel, AppModel } from 'app/models';

export interface RootState {
  user: RootState.UserState;
  assets: RootState.AssetsState;
  app: RootState.AppState;
  router?: any;
}

export namespace RootState {
  export type UserState = UserModel;
  export type AppState = AppModel;
  export type AssetsState = AssetModel[];
}
