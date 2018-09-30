import * as React from 'react';
import {RefObject} from 'react';
import TopMenu from './TopMenu';
import BoardsList from './BoardsList';
import {hasBackgroundImage, getBackgroundImage} from '../helpers/LocalStorageHelper';

type UiContainerState = {
    backgroundUpdated: boolean;
}

export default class UiContainer extends React.PureComponent {
    private backgroundHolder: RefObject<HTMLDivElement>;
    state: UiContainerState;

    constructor(props: {}, state: UiContainerState) {
        super(props, state);

        this.state = {
            backgroundUpdated: false,
        };
        this.backgroundHolder = React.createRef();
        this.update = this.update.bind(this);
        this.reloadBackground = this.reloadBackground.bind(this);
    }

    componentDidMount() {
        this.reloadBackground();
    }

    componentDidUpdate() {
        this.reloadBackground();
    }

    render(): React.ReactNode {
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

    update() {
        this.setState({backgroundUpdated: !this.state.backgroundUpdated});
    }

    reloadBackground() {
        if (hasBackgroundImage()) {
            this.backgroundHolder.current.setAttribute('style', 'background-image: url(' + getBackgroundImage() + ')');
        }
    }
}
