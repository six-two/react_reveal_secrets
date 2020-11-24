import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import ModeScreen from './ModeScreen';
import SecretTypeScreen from './SecretTypeScreen';
import SecretFileUploadScreen from './SecretFileUploadScreen';
import SecretTextScreen from './SecretTextScreen';
import ShareCountScreen from './ShareCountScreen';
import ShowSharesScreen from './ShowSharesScreen';

const ScreenManager = (props: Props) => {
    switch (props.screen) {
        case C.SCREEN_MODE:
            return <ModeScreen />
        case C.SCREEN_SECRET_TYPE:
            return <SecretTypeScreen />
        case C.SCREEN_SECRET_VALUE:
            if (props.secret_is_file) {
                return <SecretFileUploadScreen />
            } else {
                return <SecretTextScreen />
            }
        case C.SCREEN_SHARE_COUNTS:
            return <ShareCountScreen />
        case C.SCREEN_SHOW_SHARES:
            return <ShowSharesScreen />
        default:
            return <h1 className="error-message">Screen not implemented: "{props.screen}"</h1>
    }
}


interface Props {
    screen: string,
    secret_is_file: boolean,
}

const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        screen: state.screen,
        secret_is_file: state.secret_is_file,
    };
};

const ReduxComponent = connect(mapStateToProps)(ScreenManager);
export default ReduxComponent;
