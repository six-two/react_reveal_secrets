import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import sjcl from 'sjcl';
import { ReduxState, ShareMetadata } from './redux/store';
import * as C from './redux/constants';
import * as Codec from './CodecConverter';

const secrets = (window as any).secrets;

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
                return secrets.str2hex(raw);
            }
        case C.SECRET_TYPE_BASE64:
            return btoa(format);
        default:
            throw new Error(`Unknown format: "${format}"`);
    }
}

const ShowSecret = (props: Props) => {
    const defaultFormat = props.metadata?.secret_format || C.SECRET_TYPE_RAW;
    const [secretHex, setSecretHex] = useState("");
    const [format, setFormat] = useState(defaultFormat);

    useEffect(
        () => {
            const hex = secrets.combine(props.shares);
            setSecretHex(hex);
        }, [props.shares]
    );

    if (!secretHex) {
        return null;
    }

    try {
        if (!props.metadata) {
            throw new Error("Metadata not set");
        }

        let secretRaw;
        if (props.metadata.constant_share_size) {
            if (props.encrypted_data === null) {
                return <div className="err-msg">
                    Internal error: Metadata not set
                </div>
            }
            // use the secret to decrypt the encrypted data
            try {
                const encrypted_data = Codec.hexToAscii(props.encrypted_data);
                secretRaw = sjcl.decrypt(secretHex, encrypted_data);
            } catch (e) {
                console.error(`secretHex=${secretHex}\nencryptedDataHex=${props.encrypted_data}`, e);
                return <div className="err-msg">
                    Internal error: Decrypting data failed
                    Error message: {e.toString()}
                </div>
            }
        } else {
            // use the secret itself
            secretRaw = secrets.hex2str(secretHex);
        }

        try {
            const output = rawToFormat(secretRaw, format);
            return <div>
                Default output: "{output}"
            </div>
        } catch (e) {
            console.warn(e);
            return <div className="err-msg">
                Failed to show data in desired output format
            </div>
        }
    } catch (e) {
        console.error('Show secrets page had an internal error', e);
        return <div className="err-msg">
            Internal error: {e.toString()}
        </div>
    }
}

interface Props {
    shares: string[],
    metadata: ShareMetadata | null,
    encrypted_data: string | null,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        shares: state.shares,
        metadata: state.metadata,
        encrypted_data: state.encrypted_data,
    };
};

const ReduxComponent = connect(mapStateToProps)(ShowSecret);

const RealShowSecret = () => {
    return <div>
        <h1>Secret</h1>

        <ReduxComponent />
    </div>
}

export default RealShowSecret;
