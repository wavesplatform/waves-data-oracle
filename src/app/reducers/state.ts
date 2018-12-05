import { UserModel, AssetModel, AppModel, OracleInfoModel } from 'app/models';

export interface RootState {
    user: RootState.UserState;
    assets: RootState.AssetsState;
    app: RootState.AppState;
    oracleInfo: RootState.OracleInfoState;
    router?: any;
}

export namespace RootState {
    export type UserState = UserModel;
    export type AppState = AppModel;
    export type AssetsState = AssetModel[];
    export type OracleInfoState = OracleInfoModel;
}
