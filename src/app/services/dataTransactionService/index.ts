import {
    getDataTxFields,
    getUrl,
} from './utils';

import * as OracleData from '@waves/oracle-data';

import {
    FEE_SEED,
} from './constants';
import { userService } from '../KeeperService';
import { data } from 'waves-transactions';
import * as request from 'superagent';

export * from './constants';


export function getAssetInfo(id: string, server?: string): Promise<INodeAssetInfo> {
    return new Promise((resolve, reject) =>
        request.get(getUrl(`/transactions/info/${id}`, server))
            .then(response => resolve(response.body))
            .then((data: any) => {
                if (data.type !== 3) {
                    throw new Error('Wrong asset transaction');
                }
            })
            .catch(reject));
}

export async function getOracleData(address: string, server?: string): Promise<IOracleData> {
    const data = await getDataTxFields(address, server) as Array<OracleData.TDataTxField>;
    const oracle = OracleData.getProviderData(data);
    const assets = OracleData.getProviderAssets(data);
    return { oracle, assets };
}


export function setOracleInfo(fields: Array<OracleData.TDataTxField>, timestamp?: number) {
    const fee = currentFee(fields);

    return userService.signAndPublishData({
        type: 12,
        data: {
            timestamp: timestamp || Date.now(),
            data: fields,
            fee: {
                coins: fee,
                assetId: 'WAVES'
            }
        }
    });
}

export function setAssetInfo(fields: Array<OracleData.TDataTxField>, timestamp?: number) {
    
    const fee = currentFee(fields);

    return userService.signAndPublishData({
        type: 12,
        data: {
            timestamp: timestamp || Date.now(),
            data: fields,
            fee: {
                coins: fee,
                assetId: 'WAVES'
            }
        }
    });
}

export function currentFee(fields: Array<OracleData.TDataTxField>): string {
    const tx = data({ data: fields }, FEE_SEED);
    return String(tx.fee);
}

export interface IOracleData {
    oracle: OracleData.TResponse<OracleData.IProviderData>;
    assets: Array<OracleData.TResponse<OracleData.TProviderAsset>>;
}

export interface INodeAssetInfo {
    assetId: string;
    issueHeight: number;
    issueTimestamp: number;
    issuer: string;
    name: string;
    description: string;
    decimals: number;
    reissuable: boolean;
    quantity: number;
    scripted: boolean;
    minSponsoredAssetFee: number;
}
