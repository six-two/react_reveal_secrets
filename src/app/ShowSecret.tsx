import React from "react";
import { connect } from 'react-redux';
import { ReduxState, SecretState } from './redux/store';
import CopyButton from './CopyTextButton';
import DownloadButton from './DownloadAsTextFile';
import SecretFormatChooser from './SecretFormatChooser';


const ShowSecret = (props: Props) => {
    if (!props.secret) {
        return <div className="err-msg">
            Internal error: Secret state is missing
        </div>
    }

    let secretDom;
    if (props.secret.error) {
        secretDom = <div className="err-msg">
            {props.secret.error}
        </div>
    } else {
        const secret = props.secret.formatted;
        secretDom = <>
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
        </>
    }

    return <div className="show-secret">
        <SecretFormatChooser />
        {secretDom}
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
