import * as request from 'superagent';

const NODE_URL = 'https://nodes.wavesplatform.com';

export function getDataTxFields(address: string, server?: string) {
    return new Promise((resolve, reject) =>
        request.get(getUrl(`/addresses/data/${address}`, server))
            .then(response => resolve(response.body))
            .catch(reject));
}

export function getUrl(path: string, server?: string): string {
    const url = new URL(server || NODE_URL);
    url.pathname = path;
    return url.toString();
}
