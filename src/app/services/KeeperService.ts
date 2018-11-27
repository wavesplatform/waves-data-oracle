import Timeout = NodeJS.Timeout;

declare const Waves: IWavesKeeperOptions;

class KeeperService {
    
    protected hasWavesPromise: Promise<IWavesKeeperOptions>|null = null;
    protected hasWavesResolve: (waves: IWavesKeeperOptions) => void|null;
    protected _t: Timeout;
    
    public async getWavesApi() {
        return Waves;
    }
    
    public async onUpdate(cb: (state: IPublicState) => void) {
        
        if (!this.hasWavesPromise) {
            this.hasWavesPromise = new Promise<IWavesKeeperOptions>(
                (res) => this.hasWavesResolve = res
            );
        }
        
        const Waves = await this.hasWavesPromise;
        const state = await this._getState();
        Waves.on('update', cb);
        cb(state);
    }
    
    public signAndPublishData(transaction: { type: number, data: any }) {
        return Waves.signAndPublishTransaction(transaction);
    }
    
    public getState(): Promise<IPublicState> {
        return this._getState();
    }
    
    protected _waitWaves(): void {
        if (typeof Waves === 'undefined' || !Waves || !Waves.publicState) {
            clearTimeout(this._t);
            this._t = setTimeout(() => this._waitWaves(), 200);
            return;
        }
        
        this.hasWavesResolve(Waves);
    }
    
    protected async _getState() {
        if (typeof Waves === 'undefined' || !Waves || !Waves.publicState) {
            throw { code: 0, message: 'Keeper not available' };
        }
        
        return await Waves.publicState();
    }
}

export const userService = new KeeperService();

export interface IPublicState {
    account: {
        address: string;
        name: string;
        networkCode: string;
        publicKey: string;
        type: string | 'seed'
    } | null;
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
