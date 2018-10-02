import * as React from "react";
import {getBackgroundImage, hasBackgroundImage} from "../service/BackgroundImageService";
import BoardsList from "./BoardsList";
import TopMenu from "./TopMenu";

interface UiContainerStateType {
    backgroundUpdated: boolean;
}

export default class UiContainer extends React.PureComponent<{}, UiContainerStateType> {
    private backgroundHolder: React.RefObject<HTMLDivElement>;

    constructor(props: {}, state: UiContainerStateType) {
        super(props, state);

        this.state = {
            backgroundUpdated: false,
        };
        this.backgroundHolder = React.createRef();
        this.update = this.update.bind(this);
        this.reloadBackground = this.reloadBackground.bind(this);
    }

    public componentDidMount() {
        this.reloadBackground();
    }

    public componentDidUpdate() {
        this.reloadBackground();
    }

    public render(): React.ReactNode {
        return(
            <div className="page-container" ref={this.backgroundHolder}>
                <div id="main-menu-holder">
                    <TopMenu title="Trololo Boards" updateAction={this.update}/>
                </div>
                <div className="content" id="content">
                    <BoardsList />
                </div>
            </div>
        );
    }

    private update() {
        this.setState({backgroundUpdated: !this.state.backgroundUpdated});
    }

    private reloadBackground() {
        if (hasBackgroundImage()) {
            this.backgroundHolder.current.setAttribute("style", "background-image: url(" + getBackgroundImage() + ")");
        }
    }
}
