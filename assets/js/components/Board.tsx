import * as React from "react";
import {columnNameMaxLength} from "../helpers/DomElementsHelper";
import {stepBackward, stepForward} from "../helpers/HistoryHelper";
import {isStepBackToggled, isStepForwardToggled} from "../helpers/NavigationHelper";
import {BoardType, ColumnType, SelectedTicketDataType} from "../helpers/TypesHelper";
import {addColumnToBoard, getBoardById, isValidColumnName} from "../service/BoardDataService";
import Column from "./Column";

interface BoardPropsType {
    boardId: number;
    selectedTicket: SelectedTicketDataType;
}

interface BoardStateType {
    columnAdding: boolean;
    columnUpdated: boolean;
}

export default class Board extends React.PureComponent<BoardPropsType, BoardStateType> {
    private static handleCombinations(e: KeyboardEvent) {
        if (isStepBackToggled(e)) {
            stepBackward();
        }
        if (isStepForwardToggled(e)) {
            stepForward();
        }
    }

    private columnNameInput: React.RefObject<HTMLInputElement>;

    constructor(props: BoardPropsType, state: BoardStateType) {
        super(props, state);

        this.state = {
            columnAdding: false,
            columnUpdated: false,
        };
        this.columnNameInput = React.createRef();
        this.toggleAddColumn = this.toggleAddColumn.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.cancelAddColumn = this.cancelAddColumn.bind(this);
        this.getColumnAddingTemplate = this.getColumnAddingTemplate.bind(this);
        this.getColumnsListTemplate = this.getColumnsListTemplate.bind(this);
        this.update = this.update.bind(this);
    }

    public render(): React.ReactNode {
        const boardId: number = this.props.boardId,
            selectedTicket: SelectedTicketDataType = this.props.selectedTicket,
            boardData: BoardType = getBoardById(boardId),
            boardCols: ColumnType[]  = boardData.cols,
            updateAction: () => void = this.update;

        let columnsTemplate: JSX.Element[] = null;

        document.onkeyup = Board.handleCombinations;

        if (boardCols.length) {
            columnsTemplate = boardCols.map((column: ColumnType, index: number) => {
                return (
                    <Column
                        key={index}
                        boardId={boardId}
                        columnId={index}
                        updateAction={updateAction}
                        selectedTicket={selectedTicket}
                    />
                );
            });
        }

        if (this.state.columnAdding) {
            return this.getColumnAddingTemplate(columnsTemplate);
        }

        return this.getColumnsListTemplate(columnsTemplate);
    }

    private getColumnsListTemplate(columnsTemplate: JSX.Element[]): JSX.Element {
        return (
            <div className="board">
                {columnsTemplate}
                <button className="add-board-button" onClick={this.toggleAddColumn}>&nbsp;</button>
            </div>
        );
    }

    private getColumnAddingTemplate(columnsTemplate: JSX.Element[]): JSX.Element {
        return (
            <div id="board" className="board">
                {columnsTemplate}
                <div className="add-column-from">
                    <input
                        type="text"
                        maxLength={columnNameMaxLength}
                        ref={this.columnNameInput}
                        className="flex-input-small flex-width-60"
                        placeholder="Column name..."
                    />
                    <button
                        className="flex-button-small add-button"
                        onClick={this.addColumn}
                    >
                        &nbsp;
                    </button>
                    <button
                        className="flex-button-small cancel-button"
                        onClick={this.cancelAddColumn}
                    >
                        &nbsp;
                    </button>
                </div>
            </div>
        );
    }

    private update() {
        this.setState({columnUpdated: !this.state.columnUpdated});
    }

    private toggleAddColumn() {
        this.setState({columnAdding: true});
    }

    private cancelAddColumn() {
        this.columnNameInput.current.value = "";
        this.setState({columnAdding: false});
    }

    private addColumn() {
        if (isValidColumnName(this.props.boardId, this.columnNameInput.current.value)) {
            addColumnToBoard(this.props.boardId, this.columnNameInput.current.value);
            this.setState({columnAdding: false});
        }
    }
}
