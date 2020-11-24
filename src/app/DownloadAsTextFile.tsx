import React from "react";
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
import { ReduxState } from './redux/store';


const DownloadAsTextFileButton = (props: Props) => {
    const onClick = (e: any) => {
        const blob = new Blob(
            [props.secret],
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
    secret: string,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        state: state,
    };
};

const ReduxComponent = connect(mapStateToProps)(DownloadAsTextFileButton);
export default ReduxComponent;

