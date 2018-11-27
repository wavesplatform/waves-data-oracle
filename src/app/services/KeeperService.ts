declare const Waves: IWavesKeeperOptions;

class KeeperService {
  
  public signAndPublishData(transaction: {type: number, data: any}) {
    return Waves.signAndPublishTransaction(transaction);
  }
  
  public getState(): Promise<IPublicState> {
     return this._getState();
  }
  
  protected async _getState() {
    if (!Waves || !Waves.publicState) {
      throw { code: 0, message: 'Keeper not available' };
    }
    
    return await Waves.publicState();
  }
}

export const UserService = new KeeperService();

export interface IPublicState {
  account: {
    address: string;
    name: string;
    networkCode: string;
    publicKey: string;
    type: string|"seed"
  }|null;
  initialized: boolean;
  locked: boolean;
}

interface IWavesKeeperOptions {
  publicState: () => Promise<IPublicState>;
  on: (ev: 'update', cb: (state: IPublicState) => void) => void;
  signAndPublishTransaction: (transaction: ITransaction) => Promise<string>;
}

interface ITransaction {
  type: number;
  data: any; //TODO transaction interface
}
