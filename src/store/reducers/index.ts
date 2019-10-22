import { combineReducers } from 'redux';
import globalReducer from './global';
import userReducer from './user';

export default combineReducers({
    global: globalReducer,
    user: userReducer,
});
