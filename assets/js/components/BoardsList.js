import React, {Component} from 'react'
import BoardItem from './BoardItem';
import {createBoard, get, isValidBoardName} from '../helpers/LocalStorageHelper';

export default class BoardsList extends Component {
    constructor() {
        super();

        this.state = {
            boards: get(),
            visible: true,
            addButtonEnabled: false,
        };
        this.addBoard = this.addBoard.bind(this);
        this.checkBoardName = this.checkBoardName.bind(this);
        this.update = this.update.bind(this);
    }

    update() {
        this.setState({boards: get()});
    }

    render() {
        var boards = this.state.boards.boards;

        if (this.state.visible) {
            var updateAction = this.update;
            if (boards.length) {
                var boardsTemplate = boards.map(function(item, index) {
                    if (item) {
                        return (<BoardItem boardid={index} key={index} updateAction={updateAction}/>);
                    }
                });
            } else {
                var boardsTemplate = '';
            }

            this.boardNameInput = React.createRef();
            this.addBoardButton = React.createRef();

            return (
                <div className="bar message-bar">
                    <div className="boards-list">
                        {boardsTemplate}
                    </div>
                    <div className="row">
                        <input
                            type="text"
                            ref={this.boardNameInput}
                            className="flex-input-small flex-width-70"
                            placeholder="Board name..."
                            onChange={this.checkBoardName}
                        />
                        <button
                            ref={this.addBoardButton}
                            className="flex-button-small uppercase"
                            disabled={!this.state.addButtonEnabled}
                            onClick={this.addBoard}
                        >Add</button>
                    </div>
                </div>
            );
        }

        return ('');
    }

    checkBoardName(e) {
        if (isValidBoardName(e.target.value) !== this.state.addButtonEnabled) {
            this.setState({
                addButtonEnabled: isValidBoardName
            });
        }
    }

    addBoard() {
        var boardNameInput = this.boardNameInput.current,
            boardName = boardNameInput.value;

        createBoard(boardName);
        this.update();
        boardNameInput.value = '';
    }
}
