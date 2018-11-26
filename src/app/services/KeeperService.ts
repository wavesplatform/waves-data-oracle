declare const Waves: any;

class KeeperService {
  
  private publicStatePromise: Promise<IPublicState>|null = null;
  
  public signAndPublishData(transaction: {type: number, data: any}) {
    return Waves.signAndPublishTransaction(transaction);
  }
  
  public async getState(): Promise<IPublicState|null> {
    if (!await this.isAvailable()) {
      return null;
    }
  
    return await this.publicStatePromise;
  }
  
  public async isAvailable(): Promise<boolean> {
    try {
      this.publicStatePromise = Waves.publicState();
      const state = await this.publicStatePromise;
      console.log(state);
      return !(state && state.account == null);
    } catch (e) {
      return false;
    }
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
