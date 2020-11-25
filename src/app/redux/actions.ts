// Needs to be here to prevent cyclic references
import store from './store';
import * as C from './constants';
import { Share } from '../ParseShare';

function d(action: Action) {
  store.dispatch(action);
}

export interface Action {
  type: string,
  payload?: string | null | Share,
};

// action creators
export function addShare(share: Share) {
  d({ type: C.ADD_SHARE, payload: share });
}

export function setEncryptedData(newValue: string) {
  d({ type: C.SET_ENCRYPTED_DATA, payload: newValue });
}

export function reset() {
  d({ type: C.RESET });
}
