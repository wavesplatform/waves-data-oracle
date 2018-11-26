declare const Waves: any;

export class KeeperService {
  
  private publicStatePromise: Promise<IState>|null = null;
  
  public signAndPublishData(transaction: {type: number, data: any}) {
    return Waves.signAndPublishTransaction(transaction);
  }
  
  public async getState() {
    if (!await this.isAvailable()) {
      return null;
    }
  
    return await this.publicStatePromise;
  }
  
  public async isAvailable(): Promise<boolean> {
    try {
      this.publicStatePromise = Waves.publicState();
      const state = await this.publicStatePromise;
      return !!(state && state.account == null);
    } catch (e) {
      return false;
    }
  }
  
}

interface IState {
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
