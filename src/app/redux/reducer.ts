import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';
import { Share } from '../ParseShare';


export default function reducer(state: ReduxState | undefined, action: Actions.Action): ReduxState {
    if (!state) {
        console.warn("No state was supplied to reducer. Falling back to default values");
        state = FALLBACK_STATE;
    }

    return wrapped_reducer(state, action);
}

function wrapped_reducer(state: ReduxState, action: Actions.Action): ReduxState {
    switch (action.type) {
        case C.ADD_SHARE: {
            const share = action.payload as Share;
            return {
                ...state,
                metadata: state.metadata || share.metadata,
                shares: [...state.shares, share.secretJsShare],
            };
        }
        case C.SET_ENCRYPTED_DATA:
            return {
                ...state,
                encrypted_data: action.payload as string,
            };
        case C.RESET:
            return {
                ...FALLBACK_STATE,
            };
        default:
            return state;
    }
}
