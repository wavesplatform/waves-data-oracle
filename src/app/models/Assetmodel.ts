import { IAssetInfo } from '../services/dataTransactionService';


export interface AssetModel extends IAssetInfo {
  id: string;
  name: string;
  amount: number;
  precession: number;
  description: string;
}
