import sjcl from 'sjcl';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';
import { convertToMyShareFormat } from './CustomShareFormat';


const secrets = (window as any).secrets;

export const isValidFormat = (secret: string, secret_format: string): boolean => {
    try {
        getSecretBytes(secret, secret_format)
        return true;
    } catch {
        return false;
    }
}

export const removeWhitespace = (text: string): string => {
    return text.replaceAll(/[\s]+/g, "");
}

export const getSecretBytesFromState = (state: ReduxState): string => {
    const secret = state.secret_is_file ? (state.secret_file || "")  : state.secret_text;
    const secret_format = state.secret_is_file ? C.SECRET_TYPE_RAW : state.secret_format;
    return getSecretBytes(secret, secret_format);
}

export const getSecretBytes = (value: string, type: string): string => {
    try {
        switch (type) {
            case C.SECRET_TYPE_RAW:
                return value;
            case C.SECRET_TYPE_HEX:
                value = removeWhitespace(value);
                // The "secrets.hex2str" function just ignores invalid characters: abc === aggggbhhhhhchh === hhhabc$$$
                // So we check, that all characters are valid, before we call it.
                if (!value.match(/^([0-9A-Fa-f]{2})*$/)) {
                    throw new Error(`Failed to decode "${value}" as hex string`);
                }
                return secrets.hex2str(value.toLowerCase());
            case C.SECRET_TYPE_BASE64:
                value = removeWhitespace(value);
                return atob(value);
            default:
                console.error(`Unknown secret type: "${type}"`);
                return value;
        }
    } catch {
        const msg = `Failed to decode "${value}" as ${type}`;
        console.debug(msg);
        throw new Error(msg);
    }
}

export const splitSecret = (state: ReduxState): SplitSecretResult => {
    try {
        let secret = getSecretBytesFromState(state);
        let encrypted_data;

        if (state.constant_size_shares) {
            const key = secrets.random(256); // a random hex string with 256 chars of entropy
            encrypted_data = sjcl.encrypt(key, secret).toString(); // use it to encrypt the secret
            secret = key; // and then make the key the thing to split
        } else {
            // convert the secret to a hex string
            secret = secrets.str2hex(secret) as string;
        }

        // TODO also add secret format to serialized share
        //TODO rework share
        const raw_shares = secrets.share(secret, state.total_share_count, state.threshold_share_count);
        const shares = convertToMyShareFormat(state, raw_shares);

        return {
            shares,
            encrypted_data,
        }
    } catch (e: any) {
        console.error("Error while splitting secret:", e);
        return {
            error: e.toString(),
        }
    }
}

export interface SplitSecretResult {
    shares?: string[],
    encrypted_data?: string,
    error?: string,
}
