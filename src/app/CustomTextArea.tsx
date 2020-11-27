import React from "react";


const CustomTextArea = (props: Props) => {
    // Make sure that the text contains no newline
    if (props.text.includes("\n")) {
        props.setText(props.text.replaceAll("\n", ""));
    }

    const onButtonClick = (e: any) => props.onSubmit();
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        if (newText.includes("\n")) {
            // the user pressed enter
            props.onSubmit();
        } else {
            props.setText(newText);
        }
    };

    return <div className="custom-text-input">
        <textarea
            autoFocus
            placeholder={props.placeholder}
            aria-multiline={false}
            value={props.text}
            onChange={onChange}
        />
        <button
            onClick={onButtonClick}>
            {"Next"}
        </button>
    </div>
}


interface Props {
    placeholder?: string,
    text: string,
    setText: (newValue: string) => void,
    onSubmit: () => void,
}

export default CustomTextArea;
