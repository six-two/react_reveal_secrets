import React from "react";
import { saveAs } from 'file-saver';


const DownloadAsTextFileButton = (props: Props) => {
    const onClick = (e: any) => {
        const fileName = props.fileName || "data.txt";
        const blob = new Blob(
            [props.content],
            { type: "text/plain;charset=utf-8" }
        );
        saveAs(blob, fileName);
    };
    return <button
        className="button txt-dl"
        onClick={onClick}>
        {props.label ? props.label : "Save text as file"}
    </button>
}

interface Props {
    label?: string,
    fileName?: string,
    content: string,
}

export default DownloadAsTextFileButton;

