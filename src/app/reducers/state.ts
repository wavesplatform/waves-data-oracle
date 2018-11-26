import { UserModel, AssetModel } from 'app/models';

export interface RootState {
  user: RootState.UserState;
  assets: RootState.AssetsState;
  router?: any;
}

export namespace RootState {
  export type UserState = UserModel;
  export type AssetsState = AssetModel[];
}
