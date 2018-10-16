import * as React from "react";
import {connect} from "react-redux";
import {BoardsStateType, BoardType} from "../helpers/TypesHelper";
import {createBoard, getBoardById, getBoards, isValidBoardName} from "../service/BoardDataService";
import Board from "./Board";
import BoardListItem from "./BoardListItem";

interface BoardsListStateType {
    boards: BoardType[];
    visible: boolean;
}

interface BoardsListPropsType {
    boardsState: BoardsStateType;
}

class BoardsList extends React.PureComponent<BoardsListPropsType, BoardsListStateType> {
    private boardNameInput: React.RefObject<HTMLInputElement>;
    private addBoardButton: React.RefObject<HTMLButtonElement>;

    constructor(props: BoardsListPropsType, state: BoardsListStateType) {
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
        if (this.props.boardsState.boardId !== -1) {
            return (
                <Board
                    boardId={this.props.boardsState.boardId}
                    boardData={getBoardById(this.props.boardsState.boardId)}
                    selectedTicket={this.props.boardsState.selectedTicket}
                />
            );
        }

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

export default connect(
    (state) => ({
        boardsState: state,
    }),
    (dispatch) => ({}),
)(BoardsList);
