import { crc16 } from 'js-crc';
import { ShareMetadata } from './redux/store';
import * as C from './redux/constants';

export interface Share {
    metadata: ShareMetadata,
    secretJsShare: string,
}

export interface ShareResult {
    errorMessage?: string,
    success?: Share,
}

const FORMAT_MAP = new Map<string, string>();
FORMAT_MAP.set('00', C.SECRET_TYPE_RAW);
FORMAT_MAP.set('01', C.SECRET_TYPE_HEX);
FORMAT_MAP.set('10', C.SECRET_TYPE_BASE64);

const splitString = (text: string, firstPartLength: number): [string, string] => {
    const part1 = text.substr(0, firstPartLength);
    const part2 = text.substr(firstPartLength);
    return [part1, part2];
}

const parseHexNumber = (hex: string, offset: number, length: number) => {
    if (length > 6) {
        throw new Error(`Due to JS internals, please have a hexLength of ${length} or less`);
    }
    hex = hex.substr(offset, length);
    if (hex.length !== length) {
        throw new Error(`Invalid hex length: "${hex}" has length ${hex.length}, but expected ${length}`);
    }

    const parsed = parseInt(hex, 16);
    if (isNaN(parsed)) {
        throw new Error(`Invalid hex: "${hex}". Int parse failed`);
    }

    return parsed;
}

const extractHexBits = (hex: string, bitOffset: number, bitCount: number) => {
    /// start counting bits at the most significant bit

    // figure out which parts of the hex need to be parsed
    const hexOffset = Math.floor(bitOffset / 4);
    bitOffset = bitOffset - (4 * hexOffset);
    const hexLength = Math.ceil((bitOffset + bitCount) / 4);

    const bits = parseHexNumber(hex, hexOffset, hexLength).toString(2);
    return bits.substr(bitOffset, bitCount);
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
        const version = bitsToNumber(extractHexBits(fullHex, 0, 2));
        if (version === 0) {
            const HEADER_LENGTH = 4;
            const tmp = verifyAndRemoveCrc16(fullHex);
            const [headerHex, secretJsHex] = splitString(tmp, HEADER_LENGTH);
            const formatBits = extractHexBits(headerHex, 2, 2);
            const secret_format = FORMAT_MAP.get(formatBits);
            if (!secret_format) {
                return {
                    errorMessage: `Unknown format (bits="${formatBits}"). Please check for updates to this application.`,
                };
            }
            const constant_share_size = extractHexBits(headerHex, 4, 1) === '1';
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

const verifyAndRemoveCrc16 = (hex: string): string => {
    const CRC_LENGTH = 4; // 4 * hexChar = 16 bits
    const [data, crc] = splitString(hex, hex.length - CRC_LENGTH);
    if (crc16(data) === crc) {
        return data;
    } else {
        throw new Error(`Checksum missmatch: Calculated "${crc16(data)}", but expected "${crc}"`);
    }
}
