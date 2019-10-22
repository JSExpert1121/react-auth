import {
    GLOBAL_CHANGE_LOCALE,
    GLOBAL_SET_TITLE
} from '../constants';
import { AnyAction } from 'redux';

type GlobalState = {
    locale: string;
    title: string;
}

const initState: GlobalState = {
    locale: 'en',
    title: 'Hit! t'
};

const globalReducer: (state: GlobalState | undefined, action: AnyAction) => GlobalState = (state = initState, action) => {

    switch (action.type) {
        case GLOBAL_CHANGE_LOCALE:
            return {
                ...state,
                locale: action.payload as string
            }
        case GLOBAL_SET_TITLE:
            return {
                ...state,
                title: action.payload as string
            }
        default:
            return state;
    }
}

export default globalReducer;