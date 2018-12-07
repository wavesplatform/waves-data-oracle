///<reference path="../../types/global.d.ts"/>


import {
    getAssetFields,
    getOracleData,
    getOracleInfoDataFields, IDataTransactionField,
    ORACLE_RESERVED_FIELDS, setOracleInfo,
    STATUSES
} from '../../src/app/services/dataTransactionService';
import * as request from 'superagent';
import config from './superagent-mock-config';
import { isEmpty } from '../../src/app/services/dataTransactionService/utils';
import { ASSET, ORACLE } from './serviceData';


const { URL } = require('universal-url');

(global as any).URL = URL;
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
            getOracleData('no-oracle').then(data => {
                expect(data.oracle).toEqual(wrapResponse(EMPTY_ORACLE));
                done();
            });
        });

        it('Check oracle without lang list', done => {
            getOracleData('oracle-info-no-lang').then(data => {
                expect(data.oracle).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Check oracle with empty lang list', done => {
            getOracleData('oracle-info-empty-lang').then(data => {
                expect(data.oracle).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Check oracle with en description', done => {
            getOracleData('oracle-info-description-en').then(data => {
                expect(data.oracle).toEqual(wrapResponse(ORACLE.DATA));
                done();
            });
        });

        it('Wrong field type', done => {
            getOracleData('oracle-info-binary-name').then(data => {
                expect(data.oracle).toEqual(wrapResponse({
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

        it('Check convert partial info to transaction fields', () => {
            const data = { ...ORACLE.DATA, name: null };
            const fields = ORACLE.FIELDS.filter(field => field.key !== ORACLE_RESERVED_FIELDS.NAME);
            expect(getOracleInfoDataFields(data).sort(comparator(i => i.key))).toEqual(fields.sort(comparator(i => i.key)));
        });

        it('Send oracle info', done => {
            let dataToSign: any = null;

            global.Waves = {
                on: ev => null,
                publicState: () => null,
                signAndPublishTransaction: data => {
                    dataToSign = data;
                    return Promise.resolve('ok');
                }
            };

            const timestamp = Date.now();

            setOracleInfo({ ...ORACLE.DATA }, timestamp)
                .then(() => {
                    expect(dataToSign).toEqual({
                        'type': 12,
                        'data': {
                            'timestamp': timestamp,
                            'data': [
                                {
                                    'key': 'oracle_name',
                                    'type': 'string',
                                    'value': 'Test Oracle Name'
                                },
                                {
                                    'key': 'oracle_mail',
                                    'type': 'string',
                                    'value': 'test@oracle.com'
                                },
                                {
                                    'key': 'oracle_site',
                                    'type': 'string',
                                    'value': 'https://test.oracle.com'
                                },
                                {
                                    'key': 'oracle_logo',
                                    'type': 'binary',
                                    'value': 'base64:logo'
                                },
                                {
                                    'key': 'oracle_logo_meta',
                                    'type': 'string',
                                    'value': 'data:image/png;base64,'
                                },
                                {
                                    'key': 'oracle_lang_list',
                                    'type': 'string',
                                    'value': 'en'
                                },
                                {
                                    'key': 'oracle_description_en',
                                    'type': 'string',
                                    'value': 'Some oracle en description'
                                }
                            ],
                            'fee': {
                                'coins': '100000',
                                'assetId': 'WAVES'
                            }
                        }
                    });
                    done();
                });
        });

        describe('Assets info', () => {
            describe('Empty asset list', () => {
                it('Check empty oracle data', done => {
                    getOracleData('no-oracle').then(data => {
                        expect(data.assets).toEqual([]);
                        done();
                    });
                });
                it('Only oracle info', done => {
                    getOracleData('oracle-info-no-lang').then(data => {
                        expect(data.assets).toEqual([]);
                        done();
                    });
                });
            });
            it('One asset', done => {
                getOracleData('with-one-asset').then(data => {
                    expect(data.assets).toEqual([wrapResponse({
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
                getOracleData('with-two-asset').then(data => {
                    expect(data.assets).toEqual([
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
                expect(getAssetFields(ASSET.DATA).sort(comparator(i => i.key))).toEqual(ASSET.FIELDS.sort(comparator<IDataTransactionField, string>(i => i.key)));
            });
        });
    });
});
