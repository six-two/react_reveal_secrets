import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setSecretIsFile } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';
import RadioBoxContainer, { Option } from '../RadioBoxContainer';


const OPTIONS: Option[] = [
    {
        value: "text",
        title: "Text",
        description: "Type your secret in a multiline text field.",
    },
    {
        value: "file",
        title: "File",
        description: "Upload a file and use its content as your secret",
    },
]


const SecretTypeScreen = (props: Props) => {
    return <div>
        <h1>Secret type</h1>

        <RadioBoxContainer
            options={OPTIONS}
            selected={props.secret_is_file ? "file" : "text"}
            setSelected={newValue => setSecretIsFile(newValue === "file")} />

        <NavigationButtons
            prev={C.SCREEN_MODE}
            next={C.SCREEN_SECRET_VALUE} />
    </div>
}


interface Props {
    secret_is_file: boolean,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        secret_is_file: state.secret_is_file,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretTypeScreen);
export default ReduxComponent;
