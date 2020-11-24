import React from "react";
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
import { ReduxState } from './redux/store';
import { SplitSecretResult } from './SplitSecret';
import { blockify } from './Formatter';

const outputToString = (output: SplitSecretResult, state: ReduxState): string => {
    if (output.shares) {
        const url = `https://secrets.six-two.dev`;
        const shares = output.shares.map((share, i) => {
            return `Share ${i + 1}: ${blockify(share)}\n\n`
        }).join('')

        let asText = `# Split secret

## Summary
This file contains a secret, which was split into parts (called shares).
When you want to reveal the secret again, you will need to have at least ${state.threshold_share_count} of the ${state.total_share_count} shares.
To reveal the secret again, just follow the directions on the following web page: ${url}

## Shares
Shares contain information about the secret.
You can give the shares to different people or keep them in separate locations (physical or digital).
Anyone having ${state.threshold_share_count - 1} or fewer shares will not be able to reconstruct the secret.
 
${shares}`;
        if (output.encrypted_data) {
            asText += `## Encrypted data
These encrypted data are needed in addition to the shares, in order to restore the secret.
When restoring the secret, you will need to supply them data.
That means that everyone, who should be able to restore the secret, needs access to these data.
You can either give everyone a copy or upload / save it in a location, where everyone can access it.
IF YOU LOOSE THIS DATA, IT WILL NOT BE POSSIBLE TO RESTORE THE SECRET!

Encrypted data: ${btoa(output.encrypted_data)}
`;
        }
        return asText;
    } else {
        return "ERROR: Your inputs are invalid.\nBUG: You should not even see this button!"
    }
}


const DownloadAsTextFileButton = (props: Props) => {
    const onClick = (e: any) => {
        const blob = new Blob(
            [outputToString(props.output, props.state)],
            { type: "text/plain;charset=utf-8" }
        );
        saveAs(blob, "split-secret.txt");
    };
    return <button
        className="button txt-dl"
        onClick={onClick}>
        {"Download as text file"}
    </button>
}



interface Props {
    output: SplitSecretResult,
    state: ReduxState
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        state: state,
    };
};

const ReduxComponent = connect(mapStateToProps)(DownloadAsTextFileButton);
export default ReduxComponent;

