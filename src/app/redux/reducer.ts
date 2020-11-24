import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';
import { getSecretBytesFromState, isValidFormat } from '../SplitSecret';


export default function reducer(state: ReduxState | undefined, action: Actions.Action): ReduxState {
    if (!state) {
        console.warn("No state was supplied to reducer. Falling back to default values");
        state = FALLBACK_STATE;
    }

    return wrapped_reducer(state, action);
}

function wrapped_reducer(state: ReduxState, action: Actions.Action): ReduxState {
    switch (action.type) {
        case C.SET_SCREEN: {
            return {
                ...state,
                screen: action.payload as string,
            }
        }
        case C.SET_TOTAL_SHARE_COUNT:
            return {
                ...state,
                total_share_count: action.payload as number,
            }
        case C.SET_THRESHOLD_SHARE_COUNT:
            return {
                ...state,
                threshold_share_count: action.payload as number,
            }
        case C.SET_SECRET_TEXT:
            return onSecretChanged({
                ...state,
                secret_text: action.payload as string,
            }, true, true);
        case C.SET_SECRET_FORMAT:
            return onSecretChanged({
                ...state,
                secret_format: action.payload as string,
            }, false, true);
        case C.SET_MODE:
            return onSecretChanged({
                ...state,
                mode: action.payload as string,
            }, true, true);
        case C.SET_CONSTANT_SHARE_SIZE:
            return {
                ...state,
                constant_size_shares: action.payload as boolean,
            }
        case C.SET_SECRET_IS_FILE:
            return onSecretChanged({
                ...state,
                secret_is_file: action.payload as boolean,
            }, false, true);
        case C.ON_SECRET_UPLOAD_DONE:
            return onSecretChanged({
                ...state,
                secret_file: action.payload as string,
                screen: C.SCREEN_SHARE_COUNTS,
            }, false, true);
        default:
            return state;
    }
}

const onSecretChanged = (state: ReduxState, updateFormat: boolean, updateShareMode: boolean): ReduxState => {
    if (updateFormat) {
        // check if the format should be updated
        if (!state.secret_is_file && state.mode === C.MODE_EASIEST) {
            // Choose the most efficient way to encode the secret
            let secret_format;
            if (isValidFormat(state.secret_text, C.SECRET_TYPE_HEX)) {
                secret_format = C.SECRET_TYPE_HEX;
            } else if (isValidFormat(state.secret_text, C.SECRET_TYPE_BASE64)) {
                secret_format = C.SECRET_TYPE_BASE64;
            } else {
                secret_format = C.SECRET_TYPE_RAW;
            }
            state = {
                ...state,
                secret_format,
            };
        }
    }

    if (updateShareMode) {
        try {
            /// Call this method, whenever the secret (in its byte array representation) gets changed
            const secretLength = getSecretBytesFromState(state).length;
            state = {
                ...state,
                constant_size_shares: secretLength >= C.USE_CONST_SIZE_THRESHOLD,
            }
        } catch {
            // The user has given us a secret, that does not match the format
        }
    }
    return state;
}
