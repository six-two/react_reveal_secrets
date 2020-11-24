import React, { useState } from "react";
import { connect } from 'react-redux';
import Files from 'react-files';
import { ReduxState } from '../redux/store';
import { secretFileUploadDone } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';


const SecretFileUploadScreen = (props: Props) => {
    let [error, setError] = useState('');
    const onError = (error: any, file: unknown) => setError(`File error: ${error.message}`);
    const onChange = (files: any[]) => {
        console.log(files);
        if (files.length === 1) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const dataString = e.target.result as string;
                    secretFileUploadDone(dataString);
                }
            }
            reader.readAsBinaryString(files[0]);
        } else {
            setError(`Unexpected file count: ${files.length}`);
        }
    };
    if (!error && !props.is_file_uploaded) {
        error = "You need to upload a file to continue";
    }

    return <div>
        <h2>Upload your secret file</h2>

        <div className="button">
            <Files
                className='files-dropzone'
                onChange={onChange}
                onError={onError}
                multiple={false}
                maxFiles={1}
                maxFileSize={1024 * 1024}
                minFileSize={0}
                clickable>
                {"Drop file here or click to upload"}
            </Files>
        </div>

        {error &&
            <div className="err-msg">
                {error}
            </div>
        }

        <NavigationButtons
            prev={C.SCREEN_SECRET_TYPE}
            next={props.is_file_uploaded ? C.SCREEN_SHARE_COUNTS : undefined} />
    </div>
}


interface Props {
    is_file_uploaded: boolean,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        is_file_uploaded: !!state.secret_file,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretFileUploadScreen);
export default ReduxComponent;
