import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from './redux/store';
import { setSecretFormat } from './redux/actions';
import * as C from './redux/constants';
import RadioBoxContainer, { Option } from './RadioBoxContainer';


const OPTIONS: Option[] = [
    {
        value: C.SECRET_TYPE_RAW,
        title: "Normal text mode",
        description: "Recommended default value. Displays the secret as normal text.",
    },
    {
        value: C.SECRET_TYPE_HEX,
        title: "Hexadecimal string",
        description: "Displays the secret as a hex string. Useful for binary data.",
    },
    {
        value: C.SECRET_TYPE_BASE64,
        title: "Base64 string",
        description: "Displays the secret as a base64 encoded string. Useful for binary data.",
    },
]


const SecretFormatChooser = (props: Props) => {
    return <div>
        <h2>Select the output format</h2>
        <RadioBoxContainer
            options={OPTIONS}
            selected={props.secretFormat}
            setSelected={setSecretFormat} />
    </div>
}

interface Props {
    secretFormat: string,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        secretFormat: state.secret ? state.secret.format : "ERROR: no secret state",
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretFormatChooser);
export default ReduxComponent;
