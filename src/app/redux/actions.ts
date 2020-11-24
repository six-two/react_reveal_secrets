// Needs to be here to prevent cyclic references
import store from './store';
import * as C from './constants';

function d(action: Action) {
  store.dispatch(action);
}

export interface Action {
  type: string,
  payload?: string | number | boolean | null,
};

// action creators
export function setScreen(newValue: string) {
  d({ type: C.SET_SCREEN, payload: newValue });
}

export function setTotalShareCount(newValue: number) {
  d({ type: C.SET_TOTAL_SHARE_COUNT, payload: newValue });
}

export function setThresholdShareCount(newValue: number) {
  d({ type: C.SET_THRESHOLD_SHARE_COUNT, payload: newValue });
}

export function setSecretText(newValue: string) {
  d({ type: C.SET_SECRET_TEXT, payload: newValue });
}

export function setSecretFormat(newValue: string) {
  d({ type: C.SET_SECRET_FORMAT, payload: newValue });
}

export function setMode(newValue: string) {
  d({ type: C.SET_MODE, payload: newValue });
}

export function setConstantShareSize(newValue: boolean) {
  d({ type: C.SET_CONSTANT_SHARE_SIZE, payload: newValue });
}

export function setSecretIsFile(newValue: boolean) {
  d({ type: C.SET_SECRET_IS_FILE, payload: newValue });
}

export function secretFileUploadDone(secretValue: string) {
  d({ type: C.ON_SECRET_UPLOAD_DONE, payload: secretValue });
}
