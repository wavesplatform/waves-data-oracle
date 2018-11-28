import { getAssets, getOracleInfo, STATUSES } from '../../src/app/services/dataTransactionService';
import * as request from 'superagent';
import config from './superagent-mock-config';
import { isEmpty } from '../../src/app/services/dataTransactionService/utils';


require('superagent-mock')(request, config);

const wrapResponse = (data: any, errors: Array<any> = []) => {
    const isEmptyData = isEmpty(data);
    const status = errors.length ? STATUSES.ERROR : isEmptyData ? STATUSES.EMPTY : STATUSES.OK;
    return { status, data, errors };
};

const ORACLE_INFO = {
    name: 'Test Oracle Name',
    site: 'https://test.oracle.com',
    mail: 'test@oracle.com',
    logo: 'logo',
    description: {
        en: 'Some oracle en description'
    }
};

const EMPTY_ORACLE = {
    name: null,
    site: null,
    mail: null,
    logo: null,
    description: null
};

describe('Data transactions service test', () => {

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
                expect(data).toEqual(wrapResponse(ORACLE_INFO));
                done();
            });
        });

        it('Check oracle with empty lang list', done => {
            getOracleInfo('oracle-info-empty-lang').then(data => {
                expect(data).toEqual(wrapResponse(ORACLE_INFO));
                done();
            });
        });

        it('Check oracle with en description', done => {
            getOracleInfo('oracle-info-description-en').then(data => {
                expect(data).toEqual(wrapResponse(ORACLE_INFO));
                done();
            });
        });

        it('Wrong field type', done => {
            getOracleInfo('oracle-info-binary-name').then(data => {
                expect(data).toEqual(wrapResponse({
                    ...ORACLE_INFO,
                    name: null
                }, [
                    {
                        key: 'name',
                        error: new Error('Wrong field type! Key "oracle_name" is not a "string"!')
                    }
                ]));
                done();
            });
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
    });
});
