import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setSecretText, setSecretFormat } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';
import RadioBoxContainer, { Option } from '../RadioBoxContainer';
import { isValidFormat } from '../SplitSecret';


const OPTIONS: Option[] = [
    {
        value: C.SECRET_TYPE_RAW,
        title: "Normal text mode",
        description: "This option is the most flexible, since it allows all normal text characters. If you are not sure which option to choose, select this one.",
    },
    {
        value: C.SECRET_TYPE_HEX,
        title: "Hexadecimal string",
        description: "Use this if you have binary data that is encoded as a hex string (using only 0-9 and a-f/A-F).",
    },
    {
        value: C.SECRET_TYPE_BASE64,
        title: "Base64 string",
        description: "Use this if you have binary data that is encoded as a base64 string. Only the default JavaScript base64 code (0-9, a-z, A-Z, '+', '/') is accepted.",
    },
]


const SecretTextScreen = (props: Props) => {
    const onChange = (e: any) => setSecretText(e.target.value);
    let errorMessage;
    if (!props.secret) {
        errorMessage = "The secret field can not be empty!"
    } else if (!isValidFormat(props.secret, props.secretFormat)) {
        errorMessage = "The secret does not match the given format. Hint: Using 'Normal text mode' should fix this."
    }

    return <div>
        <h1>Secret</h1>

        <label>
            {props.mode === C.MODE_ADVANCED &&
                <>
                    <h2>Select your secrets format</h2>
                    <RadioBoxContainer
                        options={OPTIONS}
                        selected={props.secretFormat}
                        setSelected={setSecretFormat} />
                </>
            }

            <h2>Type your secret here</h2>
            <textarea
                autoFocus
                value={props.secret}
                onChange={onChange}
                placeholder={`Type your secret here.

Example: My password is 'monkey123'`}
                rows={10}
                cols={40} />
        </label>

        {errorMessage &&
            <div className="err-msg">
                {errorMessage}
            </div>
        }

        <NavigationButtons
            prev={C.SCREEN_SECRET_TYPE}
            next={C.SCREEN_SHARE_COUNTS}
            disableNext={!!errorMessage} />
    </div>
}


interface Props {
    mode: string,
    secret: string,
    secretFormat: string,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        mode: state.mode,
        secret: state.secret_text,
        secretFormat: state.secret_format,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretTextScreen);
export default ReduxComponent;
