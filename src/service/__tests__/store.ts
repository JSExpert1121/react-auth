import MockAxios from 'jest-mock-axios';
import * as StoreAction from 'service/store';

import { API_GATEWAY_ADDRESS } from 'config/service.config';
const STORE_API_ROOT = API_GATEWAY_ADDRESS + '/api/v5/store/';

jest.mock('service/base');

const PUBLIC_TOKEN = 'public_token';
const PRIVATE_TOKEN = 'private_token';

const STORE_DATA = { name: 'store 1', address: 'store address 1' };

describe('service/store', () => {
    afterEach(() => {
        MockAxios.reset();
    });

    const fnSuc = jest.fn();
    const fnFail = jest.fn();

    test('registerStore', () => {
        StoreAction.registerStore(PRIVATE_TOKEN, STORE_DATA).then(fnSuc).catch(fnFail);

        expect(MockAxios.post).toHaveBeenCalled();
        expect(MockAxios.post).toHaveBeenCalledWith(
            STORE_API_ROOT + 'register',
            STORE_DATA,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_TOKEN}`,
                    DEVICETYPE: 'web',
                    DEVICEUUID: '0011223344',
                    CLIENTVERSION: '1.0',
                    DEVICELANGUAGE: 'en'
                }, params: {}
            }
        );

        MockAxios.mockResponse({
            status: 200,
            data: {}
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('getAllStore', () => {
        StoreAction.getAllStores(PRIVATE_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            STORE_API_ROOT + 'getallmystoresid',
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_TOKEN}`,
                    DEVICETYPE: 'web',
                    DEVICEUUID: '0011223344',
                    CLIENTVERSION: '1.0',
                    DEVICELANGUAGE: 'en'
                }, params: {}
            }
        );

        MockAxios.mockResponse({
            status: 200,
            data: {}
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });
});
