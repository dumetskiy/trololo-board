import * as React from 'react'
import {RefObject} from 'react';
import Column from './Column';
import {getBoardById, isValidColumnName, addColumnToBoard} from '../helpers/LocalStorageHelper';
import {stepForward, stepBackward} from '../helpers/HistoryHelper';
import {ColumnType, BoardType, SelectedTicketDataType} from '../helpers/TypesHelper';
import {columnNameMaxLength} from '../helpers/DomElementsHelper';

type BoardProps = {
    boardId: number;
    selectedTicket: SelectedTicketDataType;
}

type BoardStateType = {
    colAdding: boolean;
    colUpdated: boolean;
}

export default class Board extends React.PureComponent<BoardProps> {
    private columnNameInput: RefObject<HTMLInputElement>;
    state: BoardStateType;

    constructor(props: BoardProps, state: BoardStateType) {
        super(props, state);

        this.state = {
            colAdding: false,
            colUpdated: false,
        };
        this.columnNameInput = React.createRef();
        this.toggleAddColumn = this.toggleAddColumn.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.cancelAddColumn = this.cancelAddColumn.bind(this);
        this.update = this.update.bind(this);
    }

    update() {
        this.setState({colUpdated: !this.state.colUpdated});
    }

    render(): React.ReactNode {
        let boardId: number = this.props.boardId,
            selectedTicket: SelectedTicketDataType = this.props.selectedTicket,
            boardData: BoardType = getBoardById(boardId),
            boardCols: ColumnType[]  = boardData.cols,
            colsTemplate: JSX.Element[] = null,
            updateAction: Function = this.update;

        document.onkeyup = Board.handleCombinations;

        if (boardCols.length) {
            colsTemplate = boardCols.map(function(column: ColumnType, index: number) {
                return (<Column key={index}
                                boardId={boardId}
                                columnId={index}
                                updateAction={updateAction}
                                selectedTicket={selectedTicket} />);
            });
        }

        if (this.state.colAdding) {
            return (
                <div id="board" className="board">
                    {colsTemplate}
                    <div className="add-column-from">
                        <input type="text"
                               maxLength={columnNameMaxLength}
                               ref={this.columnNameInput}
                               className="flex-input-small flex-width-60"
                               placeholder="Column name..." />
                        <button className="flex-button-small add-button" onClick={this.addColumn}>&nbsp;</button>
                        <button className="flex-button-small cancel-button" onClick={this.cancelAddColumn}>&nbsp;</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="board">
                    {colsTemplate}
                    <button className="add-board-button" onClick={this.toggleAddColumn}>&nbsp;</button>
                </div>
            );
        }
    }

    toggleAddColumn() {
        this.setState({colAdding: true});
    }

    cancelAddColumn() {
        this.columnNameInput.current.value = '';
        this.setState({colAdding: false});
    }

    addColumn() {
        if (isValidColumnName(this.props.boardId, this.columnNameInput.current.value)) {
            addColumnToBoard(this.props.boardId, this.columnNameInput.current.value);
            this.setState({colAdding: false});
        }
    }

    static handleCombinations(e: KeyboardEvent) {
        if (e.keyCode === 90 && e.ctrlKey) {
            stepBackward()
        }
        if (e.keyCode === 89 && e.ctrlKey) {
            stepForward()
        }
    }
}
