import * as React from 'react';
import {RefObject} from 'react';
import TopMenu from './TopMenu';
import BoardsList from './BoardsList';
import {hasBackgroundImage, getBackgroundImage} from '../helpers/LocalStorageHelper';

export default class UiContainer extends React.PureComponent {
    private backgroundHolder: RefObject<HTMLDivElement>;
    state: Object;

    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            backgroundUpdated: false,
        };
        this.backgroundHolder = React.createRef();
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        if (hasBackgroundImage()) {
            this.backgroundHolder.current.setAttribute('style', 'background-image: url(' + getBackgroundImage() + ')');
        }
    }

    componentDidUpdate() {
        if (hasBackgroundImage()) {
            this.backgroundHolder.current.setAttribute('style', 'background-image: url(' + getBackgroundImage() + ')');
        }
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
}
