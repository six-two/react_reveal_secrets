import React from 'react';


const RadioBox = (props: RadioBoxProps) => {
    return <label className="radio-box">
        <input
            type="radio"
            name="TODO-do-i-need-this"
            value={props.option.value}
            checked={props.isSelected}
            onChange={() => props.onSelected(props.option.value)}
        />
        <div className="wrapper">
            <div className="title">
                {props.option.title}
            </div>
            {props.option.description &&
                <div className="description">
                    {props.option.description}
                </div>
            }
        </div>
    </label>
}


const RadioBoxContainer = (props: Props) => {
    return <div>
        <form>
            {props.options.map((option, index) => {
                return <RadioBox
                    key={index}
                    option={option}
                    isSelected={props.selected === option.value}
                    onSelected={props.setSelected} />
            })}
        </form>
    </div>
}


export interface Option {
    value: string,
    title: string,
    description?: string,
}

interface RadioBoxProps {
    option: Option,
    isSelected: boolean,
    onSelected: (newValue: string) => void,
}

interface Props {
    options: Option[],
    selected: string,
    setSelected: (newValue: string) => void,
}

export default RadioBoxContainer;