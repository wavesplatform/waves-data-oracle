import {
    getAssetFields,
    getAssets,
    getOracleInfo,
    getOracleInfoDataFields,
    STATUSES
} from '../../src/app/services/dataTransactionService';
import * as request from 'superagent';
import config from './superagent-mock-config';
import { isEmpty } from '../../src/app/services/dataTransactionService/utils';
import { ASSET, ORACLE } from './serviceData';


const superagentMock = require('superagent-mock')(request, config);

const wrapResponse = (data: any, errors: object = Object.create(null)) => {
    const isEmptyData = isEmpty(data);
    const status = Object.keys(errors).length ? STATUSES.ERROR : isEmptyData ? STATUSES.EMPTY : STATUSES.OK;
    return { status, data, errors };
};

const EMPTY_ORACLE = {
    name: null,
    site: null,
    mail: null,
    logo: null,
    description: null
};

const comparator = <T, R>(get: (i: T) => R) => (a: T, b: T) => {
    const _a = get(a), _b = get(b);
    return _a > _b ? 1 : _a === _b ? 0 : -1;
};

describe('Data transactions service test', () => {

    afterAll(() => {
        superagentMock.unset();
    });

    it('Check empty function', () => {
        expect(isEmpty(EMPTY_ORACLE)).toBe(true);
    });

    describe('Oracle info', () => {
        it('Check empty oracle data', done => {
            getOracleInfo('no-oracle').then(data => {
                expect(data).toEqual(wrapResponse(EMPTY_ORACLE));
                done();
            });
        });

        it('Check oracle without lang list', done => {
            getOracleInfo('oracle-info-no-lang').then(data => {
                expect(data).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Check oracle with empty lang list', done => {
            getOracleInfo('oracle-info-empty-lang').then(data => {
                expect(data).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Check oracle with en description', done => {
            getOracleInfo('oracle-info-description-en').then(data => {
                expect(data).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Wrong field type', done => {
            getOracleInfo('oracle-info-binary-name').then(data => {
                expect(data).toEqual(wrapResponse({
                    ...ORACLE.DATA,
                    name: null
                }, {
                    name: new Error('Wrong field type! Key "oracle_name" is not a "string"!')
                }));
                done();
            });
        });
        it('Check convert info to data transaction fields', () => {
            expect(getOracleInfoDataFields(ORACLE.DATA).sort(comparator(i => i.key))).toEqual(ORACLE.FIELDS.sort(comparator(i => i.key)));
        });
    });

    describe('Assets info', () => {
        describe('Empty asset list', () => {
            it('Check empty oracle data', done => {
                getAssets('no-oracle').then(data => {
                    expect(data).toEqual([]);
                    done();
                });
            });
            it('Only oracle info', done => {
                getAssets('oracle-info-no-lang').then(data => {
                    expect(data).toEqual([]);
                    done();
                });
            });
        });
        it('One asset', done => {
            getAssets('with-one-asset').then(data => {
                expect(data).toEqual([wrapResponse({
                    id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
                    email: 'test-asset@oracle.com',
                    logo: 'asset-logo',
                    site: 'https://test-asset.com',
                    status: 1,
                    ticker: 'TEST',
                    description: {
                        en: 'Test asset en description'
                    }
                })]);
                done();
            });
        });
        it('two assets', done => {
            getAssets('with-two-asset').then(data => {
                expect(data).toEqual([
                    wrapResponse({
                        id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
                        email: 'test-asset@oracle.com',
                        logo: 'asset-logo',
                        site: 'https://test-asset.com',
                        status: 1,
                        ticker: 'TEST',
                        description: {
                            en: 'Test asset en description'
                        }
                    }),
                    wrapResponse({
                        id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJe',
                        email: 'test-asset@oracle.com',
                        logo: 'asset-logo',
                        site: 'https://test-asset.com',
                        status: 2,
                        ticker: 'TEST',
                        description: {
                            en: 'Test asset en description'
                        }
                    })
                ]);
                done();
            });
        });
        it('Check convert asset to data transaction fields', () => {
            expect(getAssetFields(ASSET.DATA).sort(comparator(i => i.key))).toEqual(ASSET.FIELDS.sort(comparator(i => i.key)));
        });
    });
});
