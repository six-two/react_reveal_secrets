import { crc16 } from 'js-crc';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';

const FORMAT_BITS = new Map<string, string>();
FORMAT_BITS.set(C.SECRET_TYPE_RAW, '00');
FORMAT_BITS.set(C.SECRET_TYPE_HEX, '01');
FORMAT_BITS.set(C.SECRET_TYPE_BASE64, '10');

const bits2hex = (bits: string, targetedHexLength: number) => {
    targetedHexLength *= 4;
    // Add trailing zeros, till it can be converted into hex
    while (bits.length < targetedHexLength) {
        bits += "0";
    }
    if (bits.length !== targetedHexLength) {
        throw new Error(`Bit string too long: Got ${bits.length}, but expected ${targetedHexLength}`);
    }

    let hex = "";
    for (let i = 0; i < bits.length; i += 4) {
        const nextFourBits = bits.substr(i, 4);
        hex += parseInt(nextFourBits, 2).toString(16);
    }
    return hex;
}

const byte2hex = (byte: number) => {
    if (byte < 0 || byte > 255) {
        throw new Error(`Number is out of byte range: ${byte}`);
    }
    let hexString = byte.toString(16);
    while (hexString.length < 2) {
        hexString = '0' + hexString;
    }
    return hexString;
}

export const convertToMyShareFormat = (state: ReduxState, secretJsShares: string[]): string[] => {
    const versionBits = '00'; // 2 bits
    const formatBits = FORMAT_BITS.get(state.secret_format); // 2 bits
    
    return secretJsShares.map(shareData => {
        if (!shareData.match(/^[0-9A-Fa-f]+$/)) {
            throw new Error(`[Internal error] SecretJS created a share, which is not a valid hex string: '${shareData}'`);
        }
        let hexData = bits2hex(versionBits + formatBits, 2); // 1 byte
        hexData += byte2hex(state.threshold_share_count); // 1 byte
        hexData += shareData;
        return hexData + crc16(hexData); // 2 bytes
    });
};
