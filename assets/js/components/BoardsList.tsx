import * as React from 'react';
import BoardListItem from './BoardListItem';
import {createBoard, get, isValidBoardName} from '../helpers/LocalStorageHelper';
import {BoardType} from '../helpers/TypesHelper';
import {RefObject} from "react";

export default class BoardsList extends React.PureComponent {
    private boardNameInput: RefObject<HTMLInputElement>;
    private addBoardButton: RefObject<HTMLButtonElement>;
    state: any;

    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            boards: get(),
            visible: true,
        };
        this.addBoard = this.addBoard.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        let boards: BoardType[] = this.state.boards.boards;

        if (this.state.visible) {
            let updateAction: Function = this.update,
                boardsTemplate: JSX.Element[] = [];

            if (boards.length) {
                boardsTemplate = boards.map(function(item: BoardType, index: number) {
                    if (item) {
                        return (<BoardListItem boardId={index} key={index} updateAction={updateAction}/>);
                    }
                });
            } else {
                boardsTemplate = [];
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
                        />
                        <button
                            ref={this.addBoardButton}
                            className="flex-button-small uppercase"
                            onClick={this.addBoard}
                        >Add</button>
                    </div>
                </div>
            );
        }

        return ('');
    }

    update() {
        this.setState({boards: get()});
    }

    addBoard() {
        let boardNameInput = this.boardNameInput.current,
            boardName = boardNameInput.value;

        if (isValidBoardName(boardName)) {
            createBoard(boardName);
            this.update();
            boardNameInput.value = '';
        }
    }
}
