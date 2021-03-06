/** Global definitions for development **/

// for style loader
declare module '*.css' {
    const styles: any;
    export = styles;
}

declare module '*.scss' {
    const styles: any;
    export = styles;
}

declare module '*.less';

declare module '*.styl' {
    const styles: any;
    export = styles;
}

declare module '*.sass' {
    const styles: any;
    export = styles;
}

interface IHash<T> {
    [key: string]: T;
}

interface ICallback<T, R> {
    (data: T): R;
}


// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;


declare module 'identity-img' {
    export function config(conf: any): void;

    export function create(address: string, conf: { size: number }): string;
}

declare module NodeJS {
    interface Global {
        Waves: {
            publicState: () => any;
            on: (ev: 'update', cb: (state: any) => void) => void;
            signAndPublishTransaction: (transaction: any) => Promise<string>;
        }
    }
}
