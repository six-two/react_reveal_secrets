import React, { useState } from "react";
import { connect } from 'react-redux';
import _ from 'lodash';
import { ReduxState, ShareMetadata } from './redux/store';
import { addShare } from './redux/actions';
import { parseShare } from './ParseShare';
import { unblockify } from './Formatter';
import CustomTextArea from './CustomTextArea';


const INITIAL_STATE: State = {
    text: '',
    error: null,
};

const ShareInputPage = (props: Props) => {
    const [state, setState] = useState(INITIAL_STATE);

    const setText = (text: string) => setState({
        ...state,
        text,
    });
    const onSubmit = () => submit(props, state, setState);


    let title, placeholder = "Please enter a share of the secret here and then press the 'Next' button (or press enter)";;
    if (props.threshold === null) {
        title = "Enter the first share";
    } else {
        const remainingCount = props.threshold - props.shares.length;
        if (remainingCount === 1) {
            title = "You are almost done"
            placeholder = "Just one more share is required. Come on, you can do it!";
        } else {
            title = `${remainingCount} more shares required`;
        }
    }

    return (
        <div>
            <h1>{title}</h1>
            {state.error &&
                <div className="err-msg">
                    {state.error}
                </div>
            }
            <CustomTextArea
                placeholder={placeholder}
                text={state.text}
                setText={setText}
                onSubmit={onSubmit} />

        </div>
    );
}

const submit = (props: Props, state: State, setState: any) => {
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

const ReduxComponent = connect(mapStateToProps)(ShareInputPage);
export default ReduxComponent;
