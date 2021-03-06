import React, { useState } from "react";
import { setEncryptedData } from './redux/actions';
import CustomTextArea from './CustomTextArea';
import { parseEncryptedData } from './ParseShare';


const EncryptedDataInput = (props: Props) => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const submit = () => {
        try {
            let data = parseEncryptedData(text);
            setEncryptedData(data);
        } catch (e) {
            console.error(e);
            setError("Base64 decode failed: You have used an invalid character. Valid characters are: 0-9, a-z, A-Z, '+', '/'.");
        }
    };

    return <div>
        <h2>Input encrypted data</h2>
        {error &&
            <div className="err-msg">
                {error}
            </div>
        }
        <CustomTextArea
            placeholder="Enter your encrypted data here"
            text={text}
            setText={setText}
            onSubmit={submit} />
    </div>
}

interface Props {
}

export default EncryptedDataInput;
