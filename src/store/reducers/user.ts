import {
    USER_LOGIN_SUCCESS,
    USER_GET_USER_SUCCESS,
    USER_GET_PROFILE_SUCCESS
} from '../constants';
import { AnyAction } from 'redux';
import { User, UserProfile } from 'types/user';

type UserState = {
    user?: User;
    profile?: UserProfile;
    token: string;
}

const initState: UserState = {
    user: undefined,
    profile: undefined,
    token: ''
};

const userReducer: (state: UserState | undefined, action: AnyAction) => UserState = (state = initState, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload as string
            }
        case USER_GET_USER_SUCCESS:
            return {
                ...state,
                user: action.payload
            }
        case USER_GET_PROFILE_SUCCESS:
            return {
                ...state,
                profile: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;