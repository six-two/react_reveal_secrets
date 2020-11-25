import React from "react";
import { connect } from 'react-redux';
import { ReduxState, ShareMetadata } from './redux/store';
import ShareInputField from './ShareInputField';
import EncryptedDataInput from './EncryptedDataInput';


const StepManager = (props: Props) => {
    if (!props.metadata) {
        // Input first share
        return <div>
            <h1>Input the first share</h1>
            <ShareInputField />
        </div>
    } else if (props.metadata.constant_share_size && props.still_needs_encrypted_data) {
        // show the summary (and if required input encrypted data)
        return <div>
            <EncryptedDataInput />
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
    still_needs_encrypted_data: boolean
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        shares: state.shares,
        metadata: state.metadata,
        still_needs_encrypted_data: !state.encrypted_data,
    };
};

const ReduxComponent = connect(mapStateToProps)(StepManager);
export default ReduxComponent;
