import * as React from "react";
import {connect} from "react-redux";
import {stepBackward, stepForward} from "../helpers/HistoryHelper";
import {actionTypeUpdateBoard} from "./UiContainer";

interface HistorySwitcherPropsType {
    onHistoryNavigate: () => void;
    hasStepForward: boolean;
    hasStepBackward: boolean;
}

class HistorySwitcher extends React.PureComponent<HistorySwitcherPropsType, {}> {
    constructor(props: HistorySwitcherPropsType, state: {}) {
        super(props, state);

        this.doStepBackward = this.doStepBackward.bind(this);
        this.doStepForward = this.doStepForward.bind(this);
    }

    public render(): React.ReactNode {
        const backwardButton: JSX.Element = this.props.hasStepBackward
                ? (<button className="menu-button backward" onClick={this.doStepBackward}>&nbsp;</button>)
                : null,
            forwardButton: JSX.Element = this.props.hasStepForward
                ? (<button className="menu-button forward" onClick={this.doStepForward}>&nbsp;</button>)
                : null;

        return (
            <div className="menu-buttons-wrap">
                {backwardButton}
                {forwardButton}
            </div>
        );
    }

    private doStepForward() {
        stepForward();
        this.props.onHistoryNavigate();
    }

    private doStepBackward() {
        stepBackward();
        this.props.onHistoryNavigate();
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        onHistoryNavigate: () => {
            dispatch(
                {
                    type: actionTypeUpdateBoard,
                });
        },
    }),
)(HistorySwitcher);
