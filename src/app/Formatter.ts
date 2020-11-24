const BLOCK_SIZE = 4;
const SUPER_BLOCK_SIZE = 4;

export const blockify = (input: string): string => {
    const blocks = [];
    for (let i = 0; i < input.length; i += BLOCK_SIZE) {
        blocks.push(input.substr(i, BLOCK_SIZE));
    }
    let output = '';
    for (let i = 0; i < blocks.length; i++) {
        let padding = '-';
        if (i % SUPER_BLOCK_SIZE === 0) {
            padding = i === 0 ? '' : ' ';
        }
        output += padding + blocks[i];
    }
    return output;
}

export const unblockify = (input: string): string => {
    const r = input.replace(/[ -]+/g, '');
    console.debug(input, '->', r);
    return r;
}