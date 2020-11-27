import React from "react";
import { connect } from 'react-redux';
import { ReduxState, SecretState } from './redux/store';
import CopyButton from './CopyTextButton';
import DownloadButton from './DownloadAsTextFile';


const ShowSecret = (props: Props) => {
    if (!props.secret) {
        return <div className="err-msg">
            Internal error: Secret state is missing
        </div>
    }

    if (props.secret.error) {
        return <div className="err-msg">
            {props.secret.error}
        </div>
    }

    // TODO add output format selection
    const secret = props.secret.formatted;
    return <div className="show-secret">
        <h2>Format: TODO</h2>
        <textarea
            disabled
            value={secret}
            cols={10} />
        <div className="buttons">
            <CopyButton
                content={secret} />
            <DownloadButton
                content={secret}
                fileName="decoded-secret.txt" />
        </div>
    </div>
}

interface Props {
    secret: SecretState | null,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        secret: state.secret,
    };
};

const ReduxComponent = connect(mapStateToProps)(ShowSecret);

const RealShowSecret = () => {
    return <div>
        <h1>Here is your secret</h1>

        <ReduxComponent />
    </div>
}

export default RealShowSecret;
