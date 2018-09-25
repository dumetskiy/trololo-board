import React, {Component} from 'react'
import {getBoardById, isValidColumnName, addColumnToBoard} from '../helpers/LocalStorageHelper';
import Column from './Column';

export default class Board extends Component {
    constructor() {
        super();

        this.state = {
            colAdding: false,
            colUpdated: false,
        };
        this.toggleAddColumn = this.toggleAddColumn.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.cancelAddColumn = this.cancelAddColumn.bind(this);
        this.update = this.update.bind(this);
    }

    update() {
        this.setState({colUpdated: !this.state.colUpdated});
    }

    render() {
        var boardId = this.props.boardid,
            boardData = getBoardById(boardId),
            boardCols = boardData.cols,
            colsTemplate = '',
            updateAction = this.update;

        this.columnNameInput = React.createRef();

        if (boardCols.length) {
            colsTemplate = boardCols.map(function(column, index) {
                return (<Column key={index} boardid={boardId} columnid={index} updateAction={updateAction} />);
            });
        }

        if (this.state.colAdding) {

            return (
                <div id="board" className="board">
                    {colsTemplate}
                    <div className="add-column-from">
                        <input type="text"
                               ref={this.columnNameInput}
                               className="flex-input-small flex-width-60"
                               placeholder="Column name..." />
                        <button className="flex-button-small add-button" onClick={this.addColumn}>&nbsp;</button>
                        <button className="flex-button-small cancel-button" onClick={this.cancelAddColumn}>&nbsp;</button>
                    </div>
                </div>
            )
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
        if (isValidColumnName(this.props.boardid, this.columnNameInput.current.value)) {
            addColumnToBoard(this.props.boardid, this.columnNameInput.current.value);
            this.setState({colAdding: false});
        }
    }
}
