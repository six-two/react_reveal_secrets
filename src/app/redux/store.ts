import { createStore } from 'redux';
import reducer from './reducer';


export interface ShareMetadata {
    version: number,
    secret_format: string,
    threshold: number,
    constant_share_size: boolean,
    hex_length: number,
}

export interface ReduxState {
    metadata: ShareMetadata | null,
    shares: string[],
    encrypted_data: string | null,
    summary_shown: boolean,
}

export const FALLBACK_STATE: ReduxState = {
    metadata: null,
    shares: [],
    encrypted_data: null,
    summary_shown: false,
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
