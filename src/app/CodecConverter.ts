
export const byteToHex = (byte: number): string => {
    if (byte < 0 || byte > 255) {
        throw new Error(`Number is out of byte range: ${byte}`);
    }
    let hexString = byte.toString(16);
    while (hexString.length < 2) {
        hexString = '0' + hexString;
    }
    return hexString;
}

export const hexToByte = (hex: string): number => {
    if (!hex.match(/^[0-9A-Fa-f]{2}$/)) {
        throw new Error(`Expected a hex string of length 2, but got "${hex}"`);
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) {
        throw new Error("Number parse failed. Note: This should not happen.")
    }
    return num;
}

export const hexToAscii = (hex: string): string => {
    if (hex.length % 2 !== 0) {
        throw new Error("hex2ascii needs an hex string with an even length");
    }
    if (!hex.match(/^[0-9A-Fa-f]+$/)) {
        throw new Error(`Invalid characters in hex string: "${hex}"`);
    }
    const values = [];
    for (let i = 0; i < hex.length; i += 2) {
        const hexByte = hex.substr(i, 2);
        const byteValue = hexToByte(hexByte);
        values.push(byteValue);
    }
    return String.fromCharCode(...values);
}

export const asciiToHex = (ascii: string): string => {
    const hexList = [];
    for (let i = 0; i < ascii.length; i++) {
        const value = ascii.charCodeAt(i);
        const hex = byteToHex(value);
        hexList.push(hex);
    }
    return hexList.join("");
}

export const base64ToAscii = (base64: string): string => {
    return atob(base64);
}

export const asciiToBase64 = (ascii: string): string => {
    return btoa(ascii);
}
