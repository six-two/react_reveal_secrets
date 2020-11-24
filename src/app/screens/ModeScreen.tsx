import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setMode } from '../redux/actions';
import * as C from '../redux/constants';
import RadioBoxContainer, { Option } from '../RadioBoxContainer';
import NavigationButtons from '../NavigationButtons';

const OPTIONS: Option[] = [
    {
        value: C.MODE_EASIEST,
        title: "Simple",
        description: "Let's the computer make some decisions on its own",
    },
    {
        value: C.MODE_ADVANCED,
        title: "Advanced",
        description: "Gives you full control over all the options",
    },
]


const ModeScreen = (props: Props) => {
    return <div>
        <h1>Mode</h1>
        <RadioBoxContainer
            options={OPTIONS}
            selected={props.mode}
            setSelected={setMode} />
        <NavigationButtons
            next={C.SCREEN_SECRET_TYPE} />
    </div>
}


interface Props {
    mode: string,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        mode: state.mode,
    };
};

const ReduxComponent = connect(mapStateToProps)(ModeScreen);
export default ReduxComponent;
