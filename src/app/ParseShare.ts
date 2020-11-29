import { crc16 } from 'js-crc';
import { ShareMetadata } from './redux/store';
import * as C from './redux/constants';
import * as Codec from './CodecConverter';


export interface Share {
    metadata: ShareMetadata,
    secretJsShare: string,
}

export interface ShareResult {
    errorMessage?: string,
    success?: Share,
}

// const secrets = (window as any).secrets;

const FORMAT_MAP = new Map<string, string>();
FORMAT_MAP.set('00', C.SECRET_TYPE_UNICODE);
FORMAT_MAP.set('01', C.SECRET_TYPE_HEX);
FORMAT_MAP.set('10', C.SECRET_TYPE_BASE64);
FORMAT_MAP.set('11', C.SECRET_TYPE_ASCII);

const splitString = (text: string, firstPartLength: number): [string, string] => {
    const part1 = text.substr(0, firstPartLength);
    const part2 = text.substr(firstPartLength);
    return [part1, part2];
}

const parseHexNumber = (hex: string, offset: number, length: number) => {
    hex = hex.substr(offset, length);
    if (length > 6) {
        throw new Error(`Due to JS internals, please have a hexLength of ${length} or less`);
    }
    if (hex.length !== length) {
        throw new Error(`Invalid hex length: "${hex}" has length ${hex.length}, but expected ${length}`);
    }

    const parsed = parseInt(hex, 16);
    if (isNaN(parsed)) {
        throw new Error(`Invalid hex: "${hex}". Int parse failed`);
    }

    return parsed;
}

const extractBitsFromHex = (hex: string, bitOffset: number, bitCount: number) => {
    /// start counting bits at the most significant bit

    // figure out which parts of the hex need to be parsed
    const hexOffset = Math.floor(bitOffset / 4);
    const correctedBitOffset = bitOffset - (4 * hexOffset);
    const hexLength = Math.ceil((correctedBitOffset + bitCount) / 4);

    let bits = parseHexNumber(hex, hexOffset, hexLength).toString(2);
    // Padd it with zeros
    while (bits.length < 4 * hexLength) {
        bits = '0' + bits;
    }
    const selectedBits = bits.substr(correctedBitOffset, bitCount);
    console.debug(`extracted bits "${selectedBits}" as (${bitOffset}, ${bitCount}) from "${hex}"`);
    console.debug(` by getting (${correctedBitOffset}, ${bitCount}) from "${bits}"`);
    return selectedBits;
}

const bitsToNumber = (bits: string): number => {
    const num = parseInt(bits, 2);
    if (isNaN(num)) {
        throw new Error(`Not a valid binary string: "${bits}"`);
    } else {
        return num;
    }
}

export const parseShare = (fullHex: string): ShareResult => {
    try {
        const version = bitsToNumber(extractBitsFromHex(fullHex, 0, 2));
        if (version === 0) {
            const HEADER_LENGTH = 4;
            let tmp;
            try {
                tmp = verifyAndRemoveCrc16(fullHex);
            } catch {
                return {
                    errorMessage: `Integrity check failed: Please make sure that you have entered the whole share, and that it contains no typos. If that does not work, try using a different share.`,
                };
            }
            const [headerHex, secretJsHex] = splitString(tmp, HEADER_LENGTH);
            const formatBits = extractBitsFromHex(headerHex, 2, 2);
            const secret_format = FORMAT_MAP.get(formatBits);
            if (!secret_format) {
                return {
                    errorMessage: `Unknown format (bits="${formatBits}"). Please check for updates to this application.`,
                };
            }
            const constant_share_size = extractBitsFromHex(headerHex, 4, 1) === '1';
            const threshold = parseHexNumber(headerHex, 2, 2);
            return {
                success: {
                    metadata: {
                        version,
                        secret_format,
                        constant_share_size,
                        threshold,
                        hex_length: fullHex.length,
                    },
                    secretJsShare: secretJsHex,
                }
            };
        } else {
            return {
                errorMessage: `Unsupported version: ${version}. Please check for updates to this application.`,
            };
        }
    } catch (e) {
        return {
            errorMessage: `Internal error: ${e.toString()}`,
        };
    }
}

export const parseEncryptedData = (fullBase64: string): string => {
    // base64 -> hex
    const fullHex = Codec.asciiToHex(Codec.base64ToAscii(fullBase64));
    // get version
    const version = bitsToNumber(extractBitsFromHex(fullHex, 0, 2));
    if (version === 0) {
        const hex = verifyAndRemoveCrc16(fullHex);
        const [_headerHex, sjclDataHex] = splitString(hex, 2);
        if (_headerHex !== "00") {
            console.warn(`Ignoring flags in header. Expected value 00, but got ${_headerHex}`);
        }
        return Codec.hexToAscii(sjclDataHex);
    } else {
        throw new Error(`Unsupported version: ${version}. Please check for updates to this application.`);
    }

}

export const verifyAndRemoveCrc16 = (hex: string): string => {
    const CRC_LENGTH = 4; // 4 * hexChar = 16 bits
    const [data, crc] = splitString(hex, hex.length - CRC_LENGTH);
    if (crc16(data) === crc) {
        return data;
    } else {
        throw new Error(`Checksum missmatch: Calculated "${crc16(data)}", but expected "${crc}"`);
    }
}
