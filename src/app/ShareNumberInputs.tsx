import React, { useState } from "react";
import { connect } from 'react-redux';
import NumericInput from "react-numeric-input";
import { ReduxState } from './redux/store';
import { setThresholdShareCount, setTotalShareCount } from './redux/actions';


const MyNumberInput = (props: Props) => {
    const [errorMsg, setErrorMsg] = useState('');
    const clearError = () => setErrorMsg('');
    const onError = (errorMessage: string, valueAsNumber: number | null, valueAsString: string) => {
        setErrorMsg(`Invalid input: ${errorMsg}`);
    };
    const onChange = (valueAsNumber: number | null) => {
        if (valueAsNumber !== null) {
            props.setValue(valueAsNumber);
        }
    }
    if (props.min > props.max) {
        console.error('Prop "min" is bigger than "max"');
    } else if (props.value < props.min || props.value > props.max) {
        // Handle values out of the allowed bounds (reminder: min and max can change)
        const clampedValue = Math.max(props.min, Math.min(props.value, props.max));
        props.setValue(clampedValue);
    }
    return (
        <div>
            <NumericInput
                min={props.min}
                max={props.max}
                value={props.value}
                strict
                onChange={onChange}
                onInvalid={onError}
                onValid={clearError} />
            {errorMsg && <div className="invalid-input">{errorMsg}</div>}
        </div>
    );
}


interface Props {
    value: number,
    min: number,
    max: number,
    setValue: (value: number) => void,
}

export const TotalShareInput = connect((state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        value: state.total_share_count,
        min: state.threshold_share_count,
        max: 255,
        setValue: setTotalShareCount
    };
})(MyNumberInput);


export const ThresholdShareInput = connect((state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        value: state.threshold_share_count,
        min: 2,
        max: state.total_share_count,
        setValue: setThresholdShareCount
    };
})(MyNumberInput);


