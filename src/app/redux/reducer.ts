import sjcl from 'sjcl';
import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';
import { Share } from '../ParseShare';
import * as Codec from '../CodecConverter';


const secrets = (window as any).secrets;

export default function reducer(state: ReduxState | undefined, action: Actions.Action): ReduxState {
    if (!state) {
        console.warn("No state was supplied to reducer. Falling back to default values");
        state = FALLBACK_STATE;
    }

    try {
        return wrapped_reducer(state, action);
    } catch (e) {
        console.error("Error in reducer:", e);
        return state;
    }
}

function wrapped_reducer(state: ReduxState, action: Actions.Action): ReduxState {
    switch (action.type) {
        case C.ADD_SHARE: {
            const share = action.payload as Share;
            const shares = [...state.shares, share.secretJsShare]
            const metadata = state.metadata || share.metadata;

            state = {
                ...state,
                metadata,
                shares,
            };

            if (shares.length === metadata.threshold) {
                state = decryptSecretReducer(state);
            }
            return state
        }
        case C.SET_ENCRYPTED_DATA:
            return {
                ...state,
                encrypted_data: action.payload as string,
            };
        case C.SET_SECRET_FORMAT: {
            if (state.secret) {
                const format = action.payload as string;
                let formatted = state.secret.formatted;
                let error = state.secret.error;
                if (state.secret.raw) {
                    try {
                        formatted = rawToFormat(state.secret.raw, format);
                        error = null;
                    } catch (e) {
                        console.error(`Error during reducer for ${action.type}`, e);
                        formatted = "An error occured";
                        error = "Could not convert the secret to the target format";
                    }
                }
                return {
                    ...state,
                    secret: {
                        ...state.secret,
                        format,
                        formatted,
                        error,
                    }
                }
            } else {
                console.error(`Action ${action.type} was fired, before the secret state was set`);
                return state;
            }
        }
        case C.RESET:
            return {
                ...FALLBACK_STATE,
            };
        default:
            return state;
    }
}

const decryptSecretReducer = (state: ReduxState): ReduxState => {
    const msg = "An internal error occured";
    let secret = {
        raw: msg,
        format: C.SECRET_TYPE_RAW,
        formatted: msg,
        error: null,
    };
    try {
        if (!state.metadata) {
            throw new Error("Invalid state: Metadata is not set")
        }
        if (state.shares.length < state.metadata.threshold) {
            throw new Error(`Too few shares: Got ${state.shares.length}, but ${state.metadata.threshold} are needed`);
        }

        const secretHex = secrets.combine(state.shares);
        // TODO use metadata info to decide hex decoding scheme
        let secretRaw;
        if (state.metadata.constant_share_size) {
            if (!state.encrypted_data) {
                throw new Error("Invalid state: Encrypted data required, but not set");
            }
            // use the secret to decrypt the encrypted data
            secretRaw = sjcl.decrypt(secretHex, state.encrypted_data);
        } else {
            // use the secret itself
            if (state.metadata.secret_format === C.SECRET_TYPE_UNICODE) {
                secretRaw = Codec.hexToUnicode(secretHex);
            } else {
                secretRaw = Codec.hexToAscii(secretHex);
            }
        }

        secret = {
            ...secret,
            raw: secretRaw,
            format: mapMetadataFormatToDisplayFormat(state.metadata.secret_format),
        };

        return {
            ...state,
            secret: {
                ...secret,
                // do this separately, since it might trigger an Error
                formatted: rawToFormat(secret.raw, secret.format),
            }
        };

    } catch (e) {
        return {
            ...state,
            secret: {
                ...secret,
                error: `Internal error: ${e.toString()}`,
            },
        }
    }
}

const mapMetadataFormatToDisplayFormat = (metadataFormat: string) => {
    switch (metadataFormat) {
        case C.SECRET_TYPE_UNICODE:
        case C.SECRET_TYPE_ASCII:
            return C.SECRET_TYPE_RAW;
        default:
            return metadataFormat;
    }
}

const rawToFormat = (raw: string, format: string): string => {
    switch (format) {
        case C.SECRET_TYPE_RAW:
            return raw;
        case C.SECRET_TYPE_HEX:
            try {
                // first try to use acsii to hex, since the output is only half as long
                return Codec.asciiToHex(raw);
            } catch {
                // fall back to unicode to hex
                return Codec.unicodeToHex(raw);
            }
        case C.SECRET_TYPE_BASE64:
            try {
                // first try to use acsii to hex, since the output is only half as long
                return Codec.asciiToBase64(raw);
            } catch {
                // first split the unicode multi byte characters into single bytes
                const unicodeHex = Codec.unicodeToHex(raw);
                // INTENTIONAL MISMATCH
                const rawAsValidAsciiBytes = Codec.hexToAscii(unicodeHex);
                // now we try it again
                return Codec.asciiToBase64(rawAsValidAsciiBytes);
            }
        default:
            throw new Error(`Unknown format: "${format}"`);
    }
}
