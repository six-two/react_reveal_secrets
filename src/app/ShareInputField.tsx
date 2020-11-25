import React, { useState } from "react";
import { connect } from 'react-redux';
import _ from 'lodash';
import { ReduxState, ShareMetadata } from './redux/store';
import { addShare } from './redux/actions';
import { parseShare } from './ParseShare';
import { unblockify } from './Formatter';
import CustomTextArea from './CustomTextArea';


const secrets = (window as any).secrets;

const INITIAL_STATE: State = {
    text: '',
    error: null,
};

const ShareInputField = (props: Props) => {
    const [state, setState] = useState(INITIAL_STATE);

    const setText = (text: string) => setState({
        ...state,
        text,
    });

    let promptText;
    if (props.threshold === null) {
        promptText = 'Please enter the first share of the secret';
    } else {
        const remainingCount = props.threshold - props.shares.length;
        if (remainingCount === 0) {
            const secretHex = secrets.combine(props.shares);
            const secret = secrets.hex2str(secretHex);

            return <div>
                Your secret is "{secret}"
            </div>
        } else if (remainingCount === 1) {
            promptText = 'One more share is required. Please enter it now';
        } else {
            promptText = `${remainingCount} more shares are required. Please enter the next one`;
        }
    }

    const submit = () => {
        try {
            // The next line will raise an error, if the input is not a valid share
            const shareResult = parseShare(unblockify(state.text));
            if (shareResult.errorMessage) {
                setState({
                    ...state,
                    error: shareResult.errorMessage,
                });
            } else if (shareResult.success) {
                const share = shareResult.success;
                if (props.shares.includes(share.secretJsShare)) {
                    setState({
                        text: '',
                        error: 'This share has already been entered. Please try another one',
                    });
                } else if (props.metadata && !_.isEqual(props.metadata, share.metadata)) {
                    setState({
                        text: '',
                        error: 'Metadata do not match. This probably means, that the shares do not belong to the same secret. Please enter a different share',
                    });
                } else {
                    setState(INITIAL_STATE);
                    addShare(share);
                }
            }
        } catch (error) {
            console.error('Error while processing share', error);
            setState({
                ...state,
                error: 'The text you entered is not a valid share.\nThis probably means you made a typo or the share is incomplete.',
            });
        }
    };

    return (
        <div>
            <div>{promptText}</div>
            {state.error &&
                <div className="err-msg">
                    {state.error}
                </div>
            }
            <CustomTextArea
                placeholder="Enter your share here"
                text={state.text}
                setText={setText}
                onSubmit={submit} />

        </div>
    );
}


interface Props {
    threshold: number | null,
    shares: string[],
    metadata: ShareMetadata | null,
}

interface State {
    text: string,
    error: string | null,
}


const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        threshold: state.metadata ? state.metadata.threshold : null,
        metadata: state.metadata,
        shares: state.shares,
    };
};

const ReduxComponent = connect(mapStateToProps)(ShareInputField);
export default ReduxComponent;
