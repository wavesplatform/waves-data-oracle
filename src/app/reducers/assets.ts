import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { AssetsActions } from 'app/actions';
import { AssetModel } from 'app/models';

const initialState: RootState.AssetsState = [];

export const AssetsReducer = handleActions<RootState.AssetsState, AssetModel|AssetModel[]>(
  {
    [AssetsActions.Type.SET_ASSETS]: (state, action) => {
      const assets = <AssetModel[]>action.payload;
      return [ ...assets ];
    },
    [AssetsActions.Type.SET_ASSET]: (state, action) => {
      const asset = <AssetModel>action.payload;
      const oldState = <AssetModel>state.find(item => item.id === asset.id);
      const index = state.indexOf(oldState);
      
      if (index === -1) {
        return [...state, asset];
      }
  
      const newState = [...state];
      newState[index] = { ...newState[index], ...asset };
      
      return newState;
    },
  },
  
  initialState
);
