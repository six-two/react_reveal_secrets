import React from "react";
import { connect } from 'react-redux';
import { ReduxState, ShareMetadata } from './redux/store';
import * as C from './redux/constants';
import ShareInputField from './ShareInputField';



const ModeScreen = (props: Props) => {
    if (!props.metadata) {
        // Input first share
        return <div>
            <h1>Input the first share</h1>
            <ShareInputField />
        </div>
    } else if (!props.summary_shown) {
        // show the summary (and if required input encrypted data)
        return <div>
            <h1>What you will need</h1>
        </div>
    } else if (props.metadata.threshold < props.shares.length) {
        // Input the rmaining shares
        return <div>
            <h1>Input the next share</h1>
            <ShareInputField />
        </div>
    } else {
        return <div>
            <h1>The secret is ...</h1>
        </div>
        // Show the decrypted secret
    }
}


interface Props {
    shares: string[],
    metadata: ShareMetadata | null,
    summary_shown: boolean,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        shares: state.shares,
        metadata: state.metadata,
        summary_shown: state.summary_shown,
    };
};

const ReduxComponent = connect(mapStateToProps)(ModeScreen);
export default ReduxComponent;
