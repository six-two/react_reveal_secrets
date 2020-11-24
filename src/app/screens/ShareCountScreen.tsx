import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import { setConstantShareSize } from '../redux/actions';
import NavigationButtons from '../NavigationButtons';
import { ThresholdShareInput, TotalShareInput } from '../ShareNumberInputs';
import RadioBoxContainer, { Option } from '../RadioBoxContainer';

const OPTIONS: Option[] = [
    {
        value: "const",
        title: "Keep shares small",
        description: "This option is best for big secrets (like files). When you choose this option your data will be encrypted by a random key. Only the key is then split, which generally results in smaller shares. The disadvantage is, that every person with a share also needs to have the encrypted file (unless you upload it somewhere where everyone can access it).",
    },
    {
        value: "var",
        title: "Store all data in the shares",
        description: "Recomended for short text secrets (like keys and passwords). When using this option every share is at least as big as the secret, which can be problematic when handling large secrets (like files).",
    },
]


const ShareCountScreen = (props: Props) => {
    return <div>
        <h1>Shares</h1>
        Your secret will be split into {props.totalCount} shares (think of them as parts).
        <br />
        Anyone having {props.thresholdCount} (or more) different shares can recover the secret.
        <br />
        It is not possible for someone with {props.thresholdCount - 1} (or fewer) shares to reconstruct the secret.
        <br />
        Use the input fields below to change these values.
        <br />
        <br />

        <h2>Total share count</h2>
        It has to be at least as high as the threshold count, but can not be bigger that 255.
        <TotalShareInput />

        <h2>Threshold share count</h2>
        It has to be at least 2 and can not be bigger than the total share count.
        <ThresholdShareInput />

        {props.mode === C.MODE_ADVANCED &&
            <>
                <h2>Share size</h2>
                <RadioBoxContainer
                    options={OPTIONS}
                    selected={props.constantSizeShares ? "const" : "var"}
                    setSelected={newValue => setConstantShareSize(newValue === "const")} />
            </>
        }

        <NavigationButtons
            prev={C.SCREEN_SECRET_VALUE}
            next={C.SCREEN_SHOW_SHARES} />
    </div >
}


interface Props {
    mode: string,
    totalCount: number,
    thresholdCount: number,
    constantSizeShares: boolean,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        mode: state.mode,
        totalCount: state.total_share_count,
        thresholdCount: state.threshold_share_count,
        constantSizeShares: state.constant_size_shares,
    };
};

const ReduxComponent = connect(mapStateToProps)(ShareCountScreen);
export default ReduxComponent;
