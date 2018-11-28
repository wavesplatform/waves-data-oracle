export interface UserModel {
    address: string;
    name: string;
    publicKey: string;
    network: string;
    error: string;
    matcher: string;
    server: string;
    balance: string|number|null;
}
