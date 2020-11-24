import { createStore } from 'redux';
import reducer from './reducer';
import * as C from './constants';

export interface ReduxState {
    screen: string,
    mode: string,
    secret_file: string | null, // only used if secret_is_file === true
    secret_text: string, // only used if secret_is_file === false
    secret_is_file: boolean,
    secret_format: string, // only used if secret_is_file === false
    total_share_count: number,
    threshold_share_count: number,
    constant_size_shares: boolean,
}

export const FALLBACK_STATE: ReduxState = {
    screen: C.SCREEN_MODE,
    mode: C.MODE_EASIEST,
    secret_file: null,
    secret_text: "",
    secret_is_file: false,
    secret_format: C.SECRET_TYPE_RAW,
    total_share_count: 5,
    threshold_share_count: 3,
    constant_size_shares: false,
}

let devTools = undefined;
if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) { // Redux dev tools are available
    let devToolOptions = {
        trace: false,
        traceLimit: 25
    };
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__(devToolOptions);
}

export const store = createStore(reducer, FALLBACK_STATE, devTools);

export default store;
