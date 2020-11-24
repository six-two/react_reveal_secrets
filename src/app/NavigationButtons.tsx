import React from "react";
import GoToScreenButton from './GoToScreenButton';


const NavigationButtons = (props: Props) => {
    return <div className="nav-buttons">
        {props.prev &&
            <GoToScreenButton
                targetScreen={props.prev}
                label={"Back"}
            />
        }
        {props.next &&
            <GoToScreenButton
                targetScreen={props.next}
                label={"Next"}
                disabled={props.disableNext}
            />
        }
    </div>
}


interface Props {
    prev?: string,
    next?: string,
    disableNext?: boolean,
}

export default NavigationButtons;
