import React from 'react';
import { setScreen } from './redux/actions';


const GoToScreenButton = (props: Props) => {
    const onClick = () => setScreen(props.targetScreen);
    return <button
        className="button-goto-screen"
        onClick={onClick}
        disabled={props.disabled}>
        {props.label}
    </button>
};


interface Props {
    label: string,
    targetScreen: string,
    disabled?: boolean,
}

export default GoToScreenButton;
