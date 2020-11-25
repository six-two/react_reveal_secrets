import React from "react";
import { connect } from 'react-redux';
import { ReduxState, ShareMetadata } from './redux/store';
import ShareInputField from './ShareInputField';
import EncryptedDataInput from './EncryptedDataInput';
import ShowSecret from './ShowSecret';


const StepManager = (props: Props) => {
    if (!props.metadata) {
        return <div>
            <h1>Input the first share</h1>
            <ShareInputField />
        </div>
    } else if (props.metadata.constant_share_size && props.still_needs_encrypted_data) {
        return <EncryptedDataInput />
    } else if (props.shares.length < props.metadata.threshold) {
        return <div>
            <h1>Input the remaining shares</h1>
            <ShareInputField />
        </div>
    } else {
        return <ShowSecret />
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
