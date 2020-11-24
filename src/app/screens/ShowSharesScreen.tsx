import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';
import { splitSecret, SplitSecretResult } from '../SplitSecret';
import { blockify } from '../Formatter';
import DownloadAsTextFileButton from '../DownloadAsTextFile';


const ShowSharesScreen = (props: Props) => {
    const defaultState: SplitSecretResult = { error: "Secret is being split. Please wait..." };
    const [state, setState] = useState(defaultState);

    useEffect(
        () => {
            const splitResult = splitSecret(props.state);
            setState(splitResult);
        }, [props.state]
    );

    return <div>
        <h1>Result</h1>
        {state.error &&
            <>
                <h2>Error</h2>
                <div className="err-msg">{state.error}</div>
            </>
        }
        {state.shares &&
            <>
                <h2>Shares</h2>
                <ol>
                    {state.shares.map((share, i) =>
                        <li key={i}>{blockify(share)}</li>
                    )}
                </ol>
                {state.encrypted_data &&
                    <>
                        <h2>Encrypted data</h2>
                        <div className="long-string">
                            {btoa(state.encrypted_data)}
                        </div>
                    </>
                }
                <DownloadAsTextFileButton
                    output={state} />
            </>
        }
        <NavigationButtons
            prev={C.SCREEN_SHARE_COUNTS} />
    </div>
}



interface Props {
    state: ReduxState,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        state: state,
    };
};

const ReduxComponent = connect(mapStateToProps)(ShowSharesScreen);
export default ReduxComponent;
