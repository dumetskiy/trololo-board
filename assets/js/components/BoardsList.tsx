import * as React from "react";
import {BoardType} from "../helpers/TypesHelper";
import {createBoard, getBoards, isValidBoardName} from "../service/BoardDataService";
import BoardListItem from "./BoardListItem";

interface BoardsListStateType {
    boards: BoardType[];
    visible: boolean;
}

export default class BoardsList extends React.PureComponent<{}, BoardsListStateType> {
    private boardNameInput: React.RefObject<HTMLInputElement>;
    private addBoardButton: React.RefObject<HTMLButtonElement>;

    constructor(props: {}, state: BoardsListStateType) {
        super(props, state);

        this.state = {
            boards: getBoards(),
            visible: true,
        };
        this.boardNameInput = React.createRef();
        this.addBoardButton = React.createRef();
        this.addBoard = this.addBoard.bind(this);
        this.update = this.update.bind(this);
    }

    public render(): React.ReactNode {
        const boards: BoardType[] = this.state.boards;

        if (this.state.visible) {
            const updateAction: () => void = this.update;

            let boardsTemplate: JSX.Element[] = [];

            if (boards.length) {
                boardsTemplate = boards.map((item: BoardType, index: number) => {
                    if (item) {
                        return (<BoardListItem boardId={index} key={index} updateAction={updateAction}/>);
                    }
                });
            }

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
                        >
                            Add
                        </button>
                    </div>
                </div>
            );
        }

        return ("");
    }

    private update() {
        this.setState({boards: getBoards()});
    }

    private addBoard() {
        const boardNameInput = this.boardNameInput.current,
            boardName = boardNameInput.value;

        if (isValidBoardName(boardName)) {
            createBoard(boardName);
            this.update();
            boardNameInput.value = "";
        }
    }
}
