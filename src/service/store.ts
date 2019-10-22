import { API_GATEWAY_ADDRESS } from 'config/service.config';
import { oauthClient } from './base';

const STORE_API_ROOT = API_GATEWAY_ADDRESS + '/api/v5/store/';

export const registerStore = (token: string, data: object) => oauthClient.authPost(STORE_API_ROOT + 'register', token, data);

export const getAllStores = (token: string) => oauthClient.authGet(STORE_API_ROOT + 'getallmystoresid', token);
