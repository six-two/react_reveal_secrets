import React from "react";
import copy from 'copy-to-clipboard';

const CopyAsTextButton = (props: Props) => {
    const onClick = (e: any) => {
        copy(props.content, {
            format: "text/plain",
        });
    };
    return <button
        className="txt-copy"
        onClick={onClick}>
        {props.label ? props.label : "Copy text"}
    </button>
}

interface Props {
    label?: string,
    content: string,
}

export default CopyAsTextButton;
